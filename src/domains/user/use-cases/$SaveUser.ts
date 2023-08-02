import { User } from "../../../entities/User"
import UserRepository from "../../../repositories/UserRepository"
import TagRepository from "../../../repositories/relearn/TagRepository"

export class $SaveUser {
  constructor(
    private userRepo = UserRepository,
    private tagRepo = TagRepository
  ) {}

  async exec(user: User) {
    const previous = await this.userRepo.findOne({
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
