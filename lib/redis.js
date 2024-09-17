import Redis from "ioredis";

// Initialize Redis client with enhanced options
const redis = new Redis(process.env.REDIS_URL, {
  // Set connection timeout
  connectTimeout: 10000, // 10 seconds

  // Define a retry strategy for reconnections
  retryStrategy: (times) => {
    // Exponential backoff with a maximum delay of 2 seconds
    const baseDelay = Math.min(times * 100, 2000);
    const jitter = Math.random() * 1000; // Random delay up to 1 second
    return baseDelay + jitter;
  },
});

// Handle Redis connection errors
redis.on("error", (err) => {
  console.error("Redis error:", err);
});

// Graceful shutdown for Redis client
process.on("SIGTERM", async () => {
  try {
    await redis.quit();
    console.log("Redis connection closed gracefully");
  } catch (err) {
    console.error("Error closing Redis connection:", err);
  } finally {
    process.exit(0);
  }
});

// Export the Redis client for use in other modules
export default redis;

const redis_expire = process.env.REDIS_EXPIRE;

export async function handleRedisOperation(
  operation,
  key,
  value = null,
  expire = redis_expire
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
    console.error(`Error during Redis ${operation} operation:`, error.message);
    throw new Error(`Redis ${operation} operation error: ${error.message}`);
  }
}
