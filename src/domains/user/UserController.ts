import { S3 } from "aws-sdk"

import {
  Body,
  CurrentUser,
  Get,
  JsonController,
  NotFoundError,
  Param,
  Post,
  Put,
  UploadedFile,
} from "routing-controllers"
import { multerConfig } from "../../config/multer"
import { dataSource } from "../../dataSource"
import { TagFollowPostDto } from "../../dtos/feed/TagFollowPostDto"
import { User } from "../../entities/User"
import { Profile } from "../../entities/feed/Profile"
import UserRepository from "../../repositories/UserRepository"
import FollowingTagRepository from "../../repositories/feed/FollowingTagRepository"
import NotificationRepository from "../../repositories/feed/NotificationRepository"
import ResourceRepository from "../../repositories/relearn/ResourceRepository"
import { UserService } from "./UserService"

@JsonController("/user")
export class UserController {
  constructor(
    private userRepo = UserRepository,
    private resourceRepo = ResourceRepository,
    private profileRepo = dataSource.getRepository(Profile),
    private followingTagRepo = FollowingTagRepository,
    private notificationRepo = NotificationRepository,
    private userService = new UserService()
  ) {}

  @Get("/:username/all")
  async getUserInfo(
    @CurrentUser({ required: true }) requester: User,
    @Param("username") username: string
  ) {
    return this.userService.getUserInfo(username, requester.id)
  }

  @Get("/:username/rated-resources")
  async getUserRatedResources(
    @CurrentUser({ required: true }) requester: User,
    @Param("username") username: string
  ) {
    const user = await this.userRepo.findOne({
      where: {
        username,
      },
    })

    if (!user) {
      throw new NotFoundError("User not found")
    }

    const resources = await this.resourceRepo.getRatedResourcesFromUser(
      user,
      user.id === requester.id
    )
    return resources
  }

  @Put("/profile")
  async updateProfile(
    @CurrentUser({ required: true }) requester: User,
    @Body() profile: Profile
  ) {
    const { pictureName, pictureUrl, ...data } = profile

    await this.profileRepo.save(data)

    // do this so we can retrieve the profile picture altogether
    const savedProfile = await this.profileRepo.findOne({
      where: {
        userId: requester.id,
      },
    })
    return savedProfile
  }

  @Post("/:username/followingTags")
  async followManyTags(
    @CurrentUser({ required: true }) requester: User,
    @Body() tagFollows: TagFollowPostDto[],
    @Param("username") username: string
  ) {
    const foundOwner = await this.userRepo.findOne({
      where: {
        username,
      },
    })

    if (!foundOwner) throw new NotFoundError("User not found")

    const tagFollowsToNotify = await this.followingTagRepo.saveTagFollows(
      requester.id,
      foundOwner.id,
      tagFollows
    )

    // notify user
    if (tagFollowsToNotify.length > 0) {
      await this.notificationRepo.createFollowingNotification(
        requester,
        foundOwner,
        tagFollowsToNotify
      )
    }

    const userFollowingTags = await this.followingTagRepo.find({
      where: {
        follower: {
          id: requester.id,
        },
      },
    })
    return userFollowingTags
  }

  @Get("/:username/followingTags")
  async getUserFollowingTags(
    @CurrentUser({ required: true }) requester: User,
    @Param("username") username: string
  ) {
    const user = await this.userRepo.findOne({ where: { username } })
    if (!user) {
      throw new NotFoundError("User not found")
    }

    const followingTags = await this.followingTagRepo.find({
      where: {
        follower: {
          id: user.id,
        },
      },
    })
    return followingTags
  }

  @Post("/picture")
  async savePicture(
    @CurrentUser({ required: true }) requester: User,
    @UploadedFile("file", { options: multerConfig }) file: any
  ) {
    const { key, location } = file

    const profileRepo = dataSource.getRepository(Profile)

    const profile = await profileRepo.findOne({
      where: { userId: requester.id },
    })

    if (!profile) {
      throw new NotFoundError("Profile not found")
    }

    // deletando a imagem anterior do usuário
    if (profile.pictureName) {
      const s3 = new S3()
      await s3
        .deleteObject({
          Bucket: "endoh",
          Key: profile.pictureName,
        })
        .promise()
    }

    profile.pictureName = key
    profile.pictureUrl = location

    const savedProfile = await profileRepo.save(profile)
    return savedProfile.pictureUrl
  }

  @Get("/new-users")
  async getNewUsers(@CurrentUser({ required: true }) requester: User) {
    return this.userService.findNewUsers()
  }
}
