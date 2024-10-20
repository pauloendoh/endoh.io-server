import { User } from "../../../entities/User"
import TagRepository from "../../../repositories/relearn/TagRepository"
import { UserRepository } from "../../../repositories/UserRepository"

export class $SaveUser {
  constructor(
    private readonly userRepo = new UserRepository(),
    private readonly tagRepo = TagRepository
  ) {}

  async exec(user: User) {
    const previous = await this.userRepo.rawRepo.findOne({
      where: { email: user.email },
    })
    const isCreated = !previous

    const savedUser = await this.userRepo.saveAndGetRelations(user)

    if (isCreated) {
      await this.tagRepo.createExampleTag(savedUser)
    }

    return savedUser
  }
}
