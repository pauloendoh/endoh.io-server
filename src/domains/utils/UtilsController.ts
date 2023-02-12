import {
  BadRequestError,
  Body,
  CurrentUser,
  Get,
  JsonController,
  Post,
  QueryParam,
} from "routing-controllers"
import { SearchResultsDto } from "../../dtos/utils/SearchResultsDto"
import { User } from "../../entities/User"
import { EmailPostDto } from "../../interfaces/dtos/auth/EmailPostDto"
import NotificationRepository from "../../repositories/feed/NotificationRepository"
import ResourceRepository from "../../repositories/relearn/ResourceRepository"
import SkillRepository from "../../repositories/skillbase/SkillRepository"
import UserRepository from "../../repositories/UserRepository"
import LinkPreviewService from "../../resolvers/utils/LinkPreview/LinkPreviewService"
import { isValidEmail } from "../../utils/email/isValidEmail"
import { sendPasswordResetEmail } from "../../utils/email/sendPasswordResetEmail"

@JsonController()
export class UtilsController {
  constructor(
    private userRepo = UserRepository,
    private notificationsRepo = NotificationRepository,
    private skillRepo = SkillRepository,
    private resourceRepo = ResourceRepository,
    private linkPreviewService = new LinkPreviewService()
  ) {}

  @Post("/utils/passwordResetEmail")
  async sendPasswordResetEmail(@Body() body: EmailPostDto) {
    const { email } = body
    if (!isValidEmail(email)) throw new BadRequestError("Invalid email.")

    const registeredUser = await this.userRepo.findOne({
      where: {
        email,
      },
    })
    if (!registeredUser) {
      return true
    }

    sendPasswordResetEmail(registeredUser)
    return true
  }

  @Get("/utils/notifications")
  async getUserNotifications(@CurrentUser({ required: true }) user: User) {
    return this.notificationsRepo.getNotifications(user.id)
  }

  @Post("/utils/notifications/seeAll")
  async seeAllNotifications(@CurrentUser({ required: true }) user: User) {
    await this.notificationsRepo
      .createQueryBuilder()
      .update()
      .set({ seen: true })
      .where("userId = :userId", { userId: user.id })
      .execute()

    const notifications = await this.notificationsRepo.getNotifications(user.id)

    return notifications
  }

  @Get("/search")
  async search(
    @CurrentUser({ required: true }) user: User,
    @QueryParam("q", { required: true }) query: string
  ) {
    const results: SearchResultsDto = {
      resources: await this.resourceRepo.getResourcesByText(user, query),
      users: await this.userRepo.getUsersByText(query),
      skills: await this.skillRepo.getByText(user.id, query),
    }

    return results
  }

  @Get("/utils/link-preview")
  async fetchLinkPreview(
    @CurrentUser({ required: true }) user: User,
    @QueryParam("url", { required: true }) url: string
  ) {
    return this.linkPreviewService.getLinkPreview(url, user.id)
  }

  @Get("/already-saved-resource")
  async findAlreadySavedResource(
    @CurrentUser({ required: true }) user: User,
    @QueryParam("url", { required: true }) url: string
  ) {
    return this.linkPreviewService.findAlreadySavedResource(user.id, url)
  }
}
