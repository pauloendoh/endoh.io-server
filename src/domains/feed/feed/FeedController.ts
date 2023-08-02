import {
  Body,
  CurrentUser,
  Get,
  JsonController,
  Put,
  QueryParam,
} from "routing-controllers"
import { User } from "../../../entities/User"
import { getFollowingTagRepo } from "../../../repositories/feed/FollowingTagRepository"
import { getUserSuggestionRepo } from "../../../repositories/feed/UserSuggestionRepository"
import { FeedService } from "./FeedService"
import { LastSeenResourcePutDto } from "./types/LastSeenResourcePutDto"

@JsonController()
export class ResourceController {
  constructor(
    private followingTagRepo = getFollowingTagRepo(),
    private userSuggestionRepo = getUserSuggestionRepo(),
    private feedService = new FeedService()
  ) {}

  @Get("/v2/feed/resources")
  async getFeedResources(
    @CurrentUser({ required: true }) user: User,
    @QueryParam("type", { required: true }) type: "completed" | "bookmarked"
  ) {
    return this.feedService.findFeedResources(user.id, type)
  }

  @Get("/v2/feed/my-user-suggestions")
  async getMyUserSuggestions(@CurrentUser({ required: true }) user: User) {
    return this.userSuggestionRepo.findUserSuggestions(user)
  }

  @Put("/feed/last-seen-resource")
  updateLastSeenResource(
    @CurrentUser({ required: true }) user: User,
    @Body() body: LastSeenResourcePutDto
  ) {
    return this.feedService.updateLastSeenResource(user.id, body.lastSeenAt)
  }

  @Get("/feed/last-seen-resource")
  getLastSeenResource(@CurrentUser({ required: true }) user: User) {
    return this.feedService.getLastSeenResource(user.id)
  }

  @Get("/feed/new-resources-count")
  findNewResourcesCount(@CurrentUser({ required: true }) user: User) {
    return this.feedService.findNewResourcesCount(user.id)
  }
}
