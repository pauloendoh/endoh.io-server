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
import { User } from "../../../entities/User"
import { Tag } from "../../../entities/relearn/Tag"
import TagRepository from "../../../repositories/relearn/TagRepository"
import { TagService } from "./TagService"

@JsonController()
export class TagController {
  constructor(
    private tagRepo = TagRepository,
    private tagService = new TagService()
  ) {}

  @Post("/relearn/tag/")
  async saveTag(
    @CurrentUser({ required: true })
    user: User,
    @Body() body: Tag
  ) {
    return this.tagService.saveTag({ data: body, userId: user.id })
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
