import { DeleteResult, In } from "typeorm"
import { dataSource } from "../dataSource"
import { UserProfileDto } from "../dtos/feed/UserProfileDto"
import { User } from "../entities/User"

// PE 1/3 - transform in a proper Repository
const UserRepository = dataSource.getRepository(User).extend({
  async getAvailableUsernameByEmail(email: string) {
    const emailArr = email.split("@")
    if (emailArr.length === 1) {
      throw Error("Invalid email")
    }

    const username = emailArr[0]
    const user = await this.findOne({
      where: {
        username,
      },
    })
    if (!user) {
      return username
    }

    let foundAvailableUsername = false
    let i = 0
    while (!foundAvailableUsername) {
      const tryUsername = username + i
      const tryUser = await this.findOne({
        where: {
          username: tryUsername,
        },
      })

      if (!tryUser) {
        foundAvailableUsername = true
        return tryUsername
      }
      i++
    }
  },

  async getTemporaryUsers(): Promise<User[]> {
    return this.createQueryBuilder("user")
      .where("user.expiresAt IS NOT NULL")
      .getMany()
  },

  async getAvailableTempUsername() {
    const tempUsers = await this.getTemporaryUsers()

    let foundAvailable = false
    let i = tempUsers.length

    while (!foundAvailable) {
      const tryUsername = "temp_user_" + i
      const tryUser = await this.findOne({
        where: {
          username: tryUsername,
        },
      })

      if (!tryUser) {
        foundAvailable = true
        return tryUsername
      }
      i++
    }
  },
  // wow, this seems dangerous haha :D
  async deleteExpiredTempUsers(): Promise<DeleteResult> {
    return this.createQueryBuilder("user")
      .delete()
      .where('"expiresAt" < NOW()')
      .execute()
  },

  /**
   *
   * @deprecated use $Save instead
   */
  async saveAndGetRelations(user: User) {
    const savedUser = await this.save(user)
    return this.findOneOrFail({
      where: { id: savedUser.id },
      relations: ["preference"],
    })
  },
  async getUsersByText(text: string): Promise<UserProfileDto[]> {
    return this.query(`
    select use."id" 		as "userId",
		   use."email",
		   pro."fullName",
		   use."username",
		   pro."bio",
		   pro."pictureUrl"
	  from "user" use
inner join profile pro on pro."userId" = use."id"
     where use."username" ilike '%${text}%'
	    or use."email"	  ilike '%${text}%'
		or pro."fullName" ilike '%${text}%'`)
  },

  async createUserForUnitTests(username: string): Promise<User> {
    return this.save({
      username,
      email: username + "@" + username,
      password: username,
    })
  },

  async findByUserIds(userIds: number[]): Promise<User[]> {
    return dataSource.getRepository(User).find({
      where: {
        id: In(userIds),
      },
    })
  },
})

export default UserRepository
