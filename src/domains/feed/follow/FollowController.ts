import {
  CurrentUser,
  Get,
  JsonController,
  Param,
  Post,
} from "routing-controllers"
import { User } from "../../../entities/User"
import { FollowService } from "./FollowService"

@JsonController()
export class FollowController {
  constructor(private followService = new FollowService()) {}

  @Post("/user/:id/toggle-follow")
  async toggleFollowUser(
    @Param("id") userId: number,
    @CurrentUser({ required: true }) requester: User
  ) {
    return this.followService.toggleFollow(requester.id, userId)
  }

  @Get("/me/following-users")
  async findMyFollowingUsers(@CurrentUser({ required: true }) requester: User) {
    return this.followService.findFollowingUsers(requester.id)
  }

  @Get("/user/:userId/followers")
  async findFollowers(@Param("userId") userId: number) {
    return this.followService.findFollowers(userId)
  }

  @Get("/user/:userId/following-users")
  async findFollowingUsers(@Param("userId") userId: number) {
    return this.followService.findFollowingUsers(userId)
  }

  @Get("/follow/most-followed-users")
  async mostFollowedUsers() {
    return this.followService.findMostFollowedUsers()
  }
}
