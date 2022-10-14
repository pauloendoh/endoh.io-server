import { config } from "dotenv"
import Redis from "ioredis"
config()

const myRedis = new Redis(process.env.REDIS_URL, {
  connectTimeout: 10000,
})

export default myRedis
