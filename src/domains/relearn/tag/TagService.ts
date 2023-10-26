import { BadRequestError } from "routing-controllers"
import { Not } from "typeorm"
import { Tag } from "../../../entities/relearn/Tag"
import TagRepository from "../../../repositories/relearn/TagRepository"

export class TagService {
  constructor(private tagRepo = TagRepository) {}

  async saveTag(params: { data: Tag; userId: number }) {
    const { data, userId } = params
    data.name = data.name.trim()

    if (data.id) {
      const isOwner = await this.tagRepo.find({
        where: {
          id: data.id,
          userId: userId,
        },
      })
      if (!isOwner) {
        throw new BadRequestError("User does not own this tag.")
      }
    }
    const nameExists = await this.tagRepo.findOne({
      where: {
        name: data.name,
        userId: userId,
        id: Not(data.id),
      },
    })
    if (nameExists) {
      throw new BadRequestError("Tag name must be unique.")
    }

    const saved = await this.tagRepo.save({
      ...data,
      user: undefined,
      userId,
      resources: undefined,
      updatedAt: undefined,
    })

    return saved
  }
}
