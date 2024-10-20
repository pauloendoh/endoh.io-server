import { DeleteResult, In, Repository } from "typeorm"
import { dataSource } from "../dataSource"
import { UserProfileDto } from "../dtos/feed/UserProfileDto"
import { User } from "../entities/User"

// PE 1/3 - transform in a proper Repository
export class UserRepository {
  public readonly rawRepo: Repository<User>

  constructor(private readonly db = dataSource) {
    this.rawRepo = db.getRepository(User)
  }

  async findById(id: number) {
    return this.db.getRepository(User).findOne({
      where: {
        id,
      },
    })
  }

  async findNewUsers() {
    return this.db.getRepository(User).find({
      order: {
        createdAt: "DESC",
      },
      relations: ["profile"],
    })
  }

  async getAvailableUsernameByEmail(email: string) {
    const emailArr = email.split("@")
    if (emailArr.length === 1) {
      throw Error("Invalid email")
    }

    const username = emailArr[0]
    const user = await this.db.getRepository(User).findOne({
      where: {
        username,
      },
    })
    if (!user) {
      return username
    }

    let i = 0
    while (true) {
      const tryUsername = username + i
      const tryUser = await this.db.getRepository(User).findOne({
        where: {
          username: tryUsername,
        },
      })

      if (!tryUser) {
        return tryUsername
      }
      i++
    }
  }

  async getTemporaryUsers(): Promise<User[]> {
    return this.db
      .getRepository(User)
      .createQueryBuilder("user")
      .where("user.expiresAt IS NOT NULL")
      .getMany()
  }

  async getAvailableTempUsername() {
    const tempUsers = await this.getTemporaryUsers()

    let foundAvailable = false
    let i = tempUsers.length

    while (!foundAvailable) {
      const tryUsername = "temp_user_" + i
      const tryUser = await this.db.getRepository(User).findOne({
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
  }
  // wow, this seems dangerous haha :D
  async deleteExpiredTempUsers(): Promise<DeleteResult> {
    return this.db
      .getRepository(User)
      .createQueryBuilder("user")
      .delete()
      .where('"expiresAt" < NOW()')
      .execute()
  }

  /**
   *
   * @deprecated use $Save instead
   */
  async saveAndGetRelations(user: User) {
    const savedUser = await this.db.getRepository(User).save(user)
    return this.db.getRepository(User).findOneOrFail({
      where: { id: savedUser.id },
      relations: ["preference"],
    })
  }
  async getUsersByText(text: string): Promise<UserProfileDto[]> {
    return this.db.getRepository(User).query(`
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
  }

  async createUserForUnitTests(username: string): Promise<User> {
    return this.db.getRepository(User).save({
      username,
      email: username + "@" + username,
      password: username,
    })
  }

  async findByUserIds(userIds: number[]): Promise<User[]> {
    return dataSource.getRepository(User).find({
      where: {
        id: In(userIds),
      },
    })
  }
}
