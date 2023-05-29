import { CurrentUser, Get, JsonController } from "routing-controllers"
import { User } from "../../../entities/User"
import { getFollowingTagRepo } from "../../../repositories/feed/FollowingTagRepository"
import { getUserSuggestionRepo } from "../../../repositories/feed/UserSuggestionRepository"
import { FeedService } from "./FeedService"

@JsonController()
export class ResourceController {
  constructor(
    private followingTagRepo = getFollowingTagRepo(),
    private userSuggestionRepo = getUserSuggestionRepo(),
    private feedService = new FeedService()
  ) {}

  @Get("/v2/feed/resources")
  async getFeedResources(@CurrentUser({ required: true }) user: User) {
    return this.feedService.findFeedResources(user.id)
  }

  @Get("/v2/feed/my-user-suggestions")
  async getMyUserSuggestions(@CurrentUser({ required: true }) user: User) {
    return this.userSuggestionRepo.findUserSuggestions(user)
  }
}
