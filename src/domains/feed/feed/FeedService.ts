import { FollowRepository } from "../follow/FollowRepository"
import { FeedRepository } from "./FeedRepository"

export class FeedService {
  constructor(
    private feedRepository = new FeedRepository(),
    private followRepo = new FollowRepository()
  ) {}

  async findFeedResources(userId: number) {
    const followees = await this.followRepo.findFolloweesByFollowerId(userId)

    const followeeIds = followees.map((followee) => followee.followedUserId)

    const publicTags = await this.feedRepository.findPublicTagsFromUserIds(
      followeeIds
    )

    const tagIds = publicTags.map((tag) => tag.id)

    const resources = await this.feedRepository.findResourcesByTagIds(tagIds)

    return resources
  }
}
