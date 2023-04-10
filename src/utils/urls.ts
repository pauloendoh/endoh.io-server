import { config } from "dotenv"
config()

const urls = {
  // redis: `${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  malProfile: (username: string) =>
    `https://myanimelist.net/profile/${username}`,
  malFriends: (username: string) =>
    `https://myanimelist.net/profile/${username}/friends`,
}

export default urls
