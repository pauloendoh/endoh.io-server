import { config } from "dotenv";
import Redis from "ioredis";
import urls from "./urls";
config();

const myRedis = new Redis(urls.redis);

export default myRedis;
