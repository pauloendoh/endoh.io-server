import { Duration } from "luxon"
import {
  BadRequestError,
  Body,
  CurrentUser,
  Get,
  JsonController,
  Post,
  QueryParam,
} from "routing-controllers"
import { IsNull, Not } from "typeorm"
import { YOUTUBE_API_KEY } from "../../config/config"
import { SearchResultsDto } from "../../dtos/utils/SearchResultsDto"
import { User } from "../../entities/User"
import { EmailPostDto } from "../../interfaces/dtos/auth/EmailPostDto"
import { LinkPreviewDto } from "../../interfaces/dtos/relearn/LinkPreviewDto"
import NotificationRepository from "../../repositories/feed/NotificationRepository"
import ResourceRepository from "../../repositories/relearn/ResourceRepository"
import SkillRepository from "../../repositories/skillbase/SkillRepository"
import UserRepository from "../../repositories/UserRepository"
import { isValidEmail } from "../../utils/email/isValidEmail"
import { sendPasswordResetEmail } from "../../utils/email/sendPasswordResetEmail"
import { isValidUrl } from "../../utils/isValidUrl"

@JsonController()
export class UtilsController {
  constructor(
    private userRepo = UserRepository,
    private notificationsRepo = NotificationRepository,
    private skillRepo = SkillRepository,
    private resourceRepo = ResourceRepository
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

  // PE 1/3 - not being used ? Use LinkPreviewService instead?
  @Post("/v2/utils/link-preview")
  async getLinkPreview(
    @CurrentUser({ required: true }) user: User,
    @QueryParam("url", { required: true }) url: string
  ) {
    if (!isValidUrl(url)) {
      throw new BadRequestError("Url is not valid.")
    }

    const foundResource = await this.resourceRepo.findOneRelationsId({
      userId: user.id,
      url,
      tagId: Not(IsNull()),
    })

    let durationStr = "00:00h"

    if (url.includes("youtube.com")) {
      const videoId = new URLSearchParams(url.split("?")[1]).get("v")
      await fetch(
        `https://youtube.googleapis.com/youtube/v3/videos?part=contentDetails%2Cstatistics&id=${videoId}&key=${YOUTUBE_API_KEY}`
      )
        .then((res) => res.json())
        .then((json) => {
          const durationObj = Duration.fromISO(
            json.items[0].contentDetails.duration
          ).toObject()

          durationStr = ""
          if (durationObj.hours) {
            if (durationObj.hours < 10) {
              durationStr += "0" + durationObj.hours
            } else {
              durationStr += durationObj.hours
            }
          } else {
            durationStr += "00"
          }
          if (durationObj.minutes) {
            if (durationObj.minutes < 10) {
              durationStr += ":0" + durationObj.minutes + "h"
            } else {
              durationStr += ":" + durationObj.minutes + "h"
            }
          } else {
            durationStr += ":00h"
          }
          return durationStr
        })
    }

    const linkPreview = await fetch(
      "http://api.linkpreview.net/?key=" +
        process.env.LINK_PREVIEW_KEY +
        "&q=" +
        url
    )
      .then((res) => res.json())
      .then((json) => {
        return json as LinkPreviewDto
      })

    linkPreview.duration = durationStr
    linkPreview["alreadySavedResource"] = foundResource

    return linkPreview
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
}
