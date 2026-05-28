import { Redis } from '@upstash/redis'
// import Redis from "ioredis";

export const redis = new Redis({
    url: 'https://endless-fish-113647.upstash.io',
    token: 'gQAAAAAAAbvvAAIgcDIzMTlkNDA5NzhlNGM0ODExOTc2MDQzMmFhNmY5ZTFlYg',
})

await redis.set("foo", "bar");
await redis.get("foo");

