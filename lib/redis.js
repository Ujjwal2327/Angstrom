// lib/redis.js
import Redis from "ioredis";

let redisInstance;

function getRedisClient() {
  if (!redisInstance) {
    redisInstance = new Redis(process.env.REDIS_URL, {
      // ── Timeouts ────────────────────────────────────────────────────────
      connectTimeout: 2500, // give up on the initial TCP+TLS handshake
      commandTimeout: 2000, // hard deadline per command

      // ── Retry policy ────────────────────────────────────────────────────
      // One retry per command. If the first attempt fails (connection closed,
      // timeout, etc.) ioredis tries once more — if that fails too the error
      // bubbles up to handleRedisOperation's catch, which returns null and
      // lets the caller fall back to Postgres.
      maxRetriesPerRequest: 1,

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
// and returning null immediately avoids both error messages and the 2-second
// wait.
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
    return null;
  }
}

// Fire both cache writes in parallel — no reason to await one before the other.
export async function updateUserCache(user, oldUsername = null) {
  if (oldUsername) await handleRedisOperation("del", `username:${oldUsername}`);
  await Promise.all([
    handleRedisOperation("set", `username:${user.username}`, user.email),
    handleRedisOperation("set", `email:${user.email}`, JSON.stringify(user)),
  ]);
}
