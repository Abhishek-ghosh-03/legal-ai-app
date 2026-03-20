import Redis from "ioredis";

let redis;

if (process.env.REDIS_URL) {
  redis = new Redis(process.env.REDIS_URL);
} else {
  console.log("⚠️ Redis not configured, skipping...");
  redis = {
    get: async () => null,
    set: async () => null
  };
}

export { redis };