import { config } from "dotenv"
import Redis from "ioredis"
import { myEnvs } from "../myEnvs"
config()

const myRedis = new Redis(myEnvs.REDIS_URL, {
  connectTimeout: 10000,
})

export default myRedis
