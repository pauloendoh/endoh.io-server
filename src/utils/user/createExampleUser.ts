import { User } from "../../entities/User"
import UserRepository from "../../repositories/UserRepository"

const createExampleUser = async (username: string) => {
  const newUser = new User()
  newUser.username = username
  newUser.email = `${username}@${username}.com`
  newUser.password = username

  const repo = UserRepository
  return await repo.save(newUser)
}

export default createExampleUser
