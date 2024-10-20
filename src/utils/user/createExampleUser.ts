import { dataSource } from "../../dataSource"
import { User } from "../../entities/User"

const createExampleUser = async (username: string) => {
  const newUser = new User()
  newUser.username = username
  newUser.email = `${username}@${username}.com`
  newUser.password = username

  const repo = dataSource.getRepository(User)
  return await repo.save(newUser)
}

export default createExampleUser
