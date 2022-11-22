import {
  BadRequestError,
  Body,
  CurrentUser,
  Delete,
  Get,
  JsonController,
  NotFoundError,
  Param,
  Post,
  Put,
} from "routing-controllers"
import { Tag } from "../../../entities/relearn/Tag"
import { User } from "../../../entities/User"
import TagRepository from "../../../repositories/relearn/TagRepository"

@JsonController()
export class TagController {
  constructor(private tagRepo = TagRepository) {}

  @Post("/relearn/tag/")
  async saveTag(
    @CurrentUser({ required: true })
    user: User,
    @Body() body: Tag
  ) {
    // trimming tag.name
    body.name = body.name.trim()

    // checking ownership
    if (body.id) {
      const isOwner = await this.tagRepo.find({
        where: {
          id: body.id,
          user,
        },
      })
      if (!isOwner) {
        throw new BadRequestError("User does not own this tag.")
      }
    } else {
      // checking if tag name already exists
      const nameExists = await this.tagRepo.findOne({
        where: {
          name: body.name,
          user: user,
        },
      })
      if (nameExists) {
        throw new BadRequestError("Tag name must be unique.")
      }
    }

    body.user = user
    body.userId = user.id

    await this.tagRepo.save(body)
    return this.tagRepo.getAllTagsFromUser(user)
  }

  @Get("/relearn/tag")
  async findAuthUserTags(
    @CurrentUser({ required: true })
    user: User
  ) {
    return this.tagRepo.getAllTagsFromUser(user)
  }

  @Delete("/relearn/tag/:id")
  async deleteTag(
    @CurrentUser({ required: true })
    user: User,
    @Param("id") tagId: number
  ) {
    const result = await this.tagRepo.delete({ id: tagId, userId: user.id })
    if (!result.affected) {
      throw new BadRequestError("Tag id not found, or user is not owner.")
    }
    return `Tag id=${tagId} deleted.`
  }

  @Put("/v2/tag/:tagId/last-opened-at")
  async updateLastOpenedTag(
    @CurrentUser({ required: true })
    user: User,
    @Param("tagId") tagId: number
  ) {
    const found = await this.tagRepo.findOne({
      where: {
        userId: user.id,
        id: tagId,
      },
    })

    if (!found) {
      throw new NotFoundError("Tag not found.")
    }

    found.lastOpenedAt = new Date().toISOString()
    const saved = await this.tagRepo.save(found)
    const savedFull = await this.tagRepo.getFullTagFromUser(saved.id, user.id)

    return savedFull
  }

  @Get("/playground/all-public-tags")
  async findAllPublicTags() {
    return this.tagRepo.findPublicTags()
  }
}
