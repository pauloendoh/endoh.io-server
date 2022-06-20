import { config } from "dotenv";
config();

const urls = {
  redis: `${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
};

export default urls;
