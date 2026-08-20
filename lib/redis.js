// lib/redis.js
import Redis from "ioredis";

let redisInstance;

function getRedisClient() {
  if (!redisInstance) {
    redisInstance = new Redis(process.env.REDIS_URL, {
      // ── Timeouts ────────────────────────────────────────────────────────
      // BUGFIX: these were 2500ms / 2000ms with 1 retry — worst case ~4s
      // spent waiting on a single command, ~8s+ across updateUserCache's
      // del+set+set. Redis here is only ever a best-effort cache with a
      // Postgres fallback on any failure (see handleRedisOperation below),
      // so there is no upside to waiting multiple seconds before giving up —
      // a slow/unreachable Redis should fail fast, not quietly eat most of
      // the Vercel function's time budget.
      connectTimeout: 1000, // give up on the initial TCP+TLS handshake
      commandTimeout: 800, // hard deadline per command

      // ── Retry policy ────────────────────────────────────────────────────
      // No retries on a per-command basis — every caller already falls back
      // to Postgres on any failure, so retrying just doubles the worst-case
      // wait for zero benefit.
      maxRetriesPerRequest: 0,

      // Reconnect with exponential back-off, give up after 3 attempts.
      retryStrategy: (times) => {
        if (times > 3) return null; // stop retrying, leave connection closed
        return Math.min(times * 200, 1500) + Math.floor(Math.random() * 200);
      },

      // ── DO NOT set lazyConnect + enableOfflineQueue:false together ───────
      // That combination was causing "Stream isn't writeable" on every first
      // command. Both options are intentionally absent here.
    });

    redisInstance.on("error", (err) => {
      // Log but never rethrow — Redis is a cache, not a source of truth.
      console.error("[Redis] connection error:", err.message);
    });

    const shutdown = async () => {
      try {
        await redisInstance.quit();
      } catch {
        /* ignore */
      }
      process.exit(0);
    };
    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);
  }
  return redisInstance;
}

const redis = getRedisClient();
export default redis;

const REDIS_EXPIRE = parseInt(process.env.REDIS_EXPIRE || "604800", 10);

// ── Connection status guard ────────────────────────────────────────────────
// ioredis has a `status` property that reflects the connection state machine:
//   "wait"        — not yet connected
//   "connecting"  — TCP/TLS handshake in progress
//   "connect"     — transport open, not yet authenticated
//   "ready"       — fully connected, accepting commands
//   "reconnecting"— lost connection, retry in progress
//   "close"       — connection closed, not retrying
//   "end"         — permanently disconnected (quit() called)
//
// Issuing a command in any state other than "ready" queues it. If the
// connection never recovers within commandTimeout that command fails with
// "Command timed out" or "Connection is closed". Checking the status first
// and returning null immediately avoids both error messages and the wait.
const READY_STATES = new Set([
  "connecting",
  "connect",
  "ready",
  "reconnecting",
]);

function isRedisUsable() {
  return READY_STATES.has(redis.status);
}

// All cache operations are best-effort — a miss is not an error.
// On any failure we return null so callers fall back to Postgres.
export async function handleRedisOperation(
  operation,
  key,
  value = null,
  expire = REDIS_EXPIRE,
) {
  if (!isRedisUsable()) {
    // Connection is closed or ended — skip silently, no console noise.
    return null;
  }

  try {
    switch (operation) {
      case "get":
        return await redis.get(key);
      case "set":
        return expire
          ? await redis.set(key, value, "EX", expire)
          : await redis.set(key, value);
      case "del":
        return await redis.del(key);
      default:
        throw new Error(`Unsupported Redis operation: ${operation}`);
    }
  } catch (error) {
    console.error(
      `[Redis] "${operation}" on "${key}" failed, using DB:`,
      error.message,
    );
    // BUGFIX (stale reads): a failed SET can leave the *old* value sitting
    // in Redis under this key. If the connection recovers before that key's
    // TTL expires, a later GET would return that stale value instead of
    // ever falling through to Postgres — exactly the "old details after
    // saving" symptom this was producing. Proactively invalidating the key
    // means the worst case after a failed write is a cache miss (safe,
    // falls through to DB), never a stale hit. Only attempted if the
    // connection itself is still usable — if it isn't, isRedisUsable()
    // already makes every subsequent get() skip Redis entirely, so there's
    // nothing to clean up yet.
    if (operation === "set" && isRedisUsable()) {
      redis.del(key).catch(() => {});
    }
    return null;
  }
}

// Fire the cache writes (and the stale-key cleanup, when needed) in
// parallel — no reason to serialize operations on independent keys.
//
// BUGFIX: previously always awaited a `del` on the old username *before*
// the two `set`s — even when the username hadn't changed, since the caller
// always passes the pre-update username regardless. That meant every save
// paid for an extra, usually pointless, sequential Redis round trip before
// the real writes even started. Now the delete only happens when the
// username actually changed, and runs alongside the sets instead of
// blocking them.
export async function updateUserCache(user, oldUsername = null) {
  const ops = [
    handleRedisOperation("set", `username:${user.username}`, user.email),
    handleRedisOperation("set", `email:${user.email}`, JSON.stringify(user)),
  ];
  if (oldUsername && oldUsername !== user.username) {
    ops.push(handleRedisOperation("del", `username:${oldUsername}`));
  }
  await Promise.all(ops);
}
