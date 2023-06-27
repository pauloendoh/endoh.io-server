import { config } from "dotenv"
config()

const urls = {
  malProfile: (username: string) =>
    `https://myanimelist.net/profile/${username}`,
  malFriends: (username: string) =>
    `https://myanimelist.net/profile/${username}/friends`,
}

export default urls
