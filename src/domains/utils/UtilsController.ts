import {
  BadRequestError,
  Body,
  CurrentUser,
  Get,
  JsonController,
  Post,
} from "routing-controllers"
import { getCustomRepository } from "typeorm"
import { User } from "../../entities/User"
import { EmailPostDto } from "../../interfaces/dtos/auth/EmailPostDto"
import NotificationRepository from "../../repositories/feed/NotificationRepository"
import UserRepository from "../../repositories/UserRepository"
import { isValidEmail } from "../../utils/email/isValidEmail"
import { sendPasswordResetEmail } from "../../utils/email/sendPasswordResetEmail"

@JsonController("/utils")
export class UtilsController {
  constructor(
    private userRepo = getCustomRepository(UserRepository),
    private notificationsRepo = getCustomRepository(NotificationRepository)
  ) {}

  @Post("/passwordResetEmail")
  async sendPasswordResetEmail(@Body() body: EmailPostDto) {
    const { email } = body
    if (!isValidEmail(email)) throw new BadRequestError("Invalid email.")

    const registeredUser = await this.userRepo.findOne({ email })
    if (!registeredUser) {
      return true
    }

    sendPasswordResetEmail(registeredUser)
    return true
  }

  @Get("/notifications")
  async getUserNotifications(@CurrentUser({ required: true }) user: User) {
    return this.notificationsRepo.getNotifications(user.id)
  }

  @Post("/notifications/seeAll")
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
}
