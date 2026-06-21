import Redis from "ioredis";

// Singleton pattern for Redis client
let redisInstance;

function getRedisClient() {
  if (!redisInstance) {
    redisInstance = new Redis(process.env.REDIS_URL, {
      connectTimeout: 10000, // 10 seconds
      retryStrategy: (times) => {
        // Exponential backoff with a maximum delay of 2 seconds
        const baseDelay = Math.min(times * 100, 2000);
        const jitter = Math.random() * 1000; // Random delay up to 1 second
        return baseDelay + jitter;
      },
    });

    redisInstance.on("error", (err) => {
      console.error("Redis error:", err);
    });

    // Graceful shutdown for Redis client
    async function shutdown() {
      try {
        await redisInstance.quit();
        console.log("Redis connection closed gracefully");
      } catch (err) {
        console.error("Error closing Redis connection:", err);
      } finally {
        process.exit(0);
      }
    }

    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown); // Handle interrupts (e.g., Ctrl+C)
  }

  return redisInstance;
}

const redis = getRedisClient();

export default redis;

const redis_expire = process.env.REDIS_EXPIRE;

// BUGFIX: this used to `throw` on any Redis error. Since every caller
// (getUserByEmail, getUserByUsername, createUser, updateUser) wraps its own
// logic in try/catch and treats *any* thrown error as a hard failure, a single
// transient Redis/Upstash hiccup used to:
//   - make `getUserByEmail` return null even though the user exists in Postgres
//     (logged-in users would suddenly look logged-out / unregistered)
//   - make `updateUser`/`createUser` report "Error updating user" to the user
//     even when the actual Postgres write had already succeeded, because the
//     cache-write step (`updateUserCache`) failing would abort the whole action
// Redis here is purely a cache — it should never be able to fail a request
// that Postgres can still serve. So now every operation catches internally,
// logs, and returns null instead of throwing. Callers already treat a null
// cache result as "cache miss" and fall back to Postgres, so this is a safe,
// non-breaking change for the happy path.
export async function handleRedisOperation(
  operation,
  key,
  value = null,
  expire = redis_expire,
) {
  try {
    let result;
    switch (operation) {
      case "get":
        result = await redis.get(key);
        break;
      case "set":
        result = expire
          ? await redis.set(key, value, "EX", expire)
          : await redis.set(key, value);
        break;
      case "del":
        result = await redis.del(key);
        break;
      default:
        throw new Error("Unsupported Redis operation.");
    }
    return result;
  } catch (error) {
    console.error(
      `Redis operation "${operation}" failed for key "${key}", falling back to source of truth:`,
      error.message,
    );
    return null;
  }
}

export async function updateUserCache(user, oldUsername = null) {
  // Cache writes are best-effort. If they fail, the request that triggered
  // this (registration, profile update, etc.) should still succeed — the
  // user's data is already safely in Postgres at this point.
  if (oldUsername) await handleRedisOperation("del", `username:${oldUsername}`);

  await Promise.all([
    handleRedisOperation("set", `username:${user.username}`, user.email),
    handleRedisOperation("set", `email:${user.email}`, JSON.stringify(user)),
  ]);
}
