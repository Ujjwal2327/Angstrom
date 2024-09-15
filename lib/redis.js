import Redis from "ioredis";

export const redis = new Redis(process.env.REDIS_URL);

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
        if (expire) result = await redis.set(key, value, "EX", expire);
        else result = await redis.set(key, value);
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
