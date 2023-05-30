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

  async updateLastSeenResource(userId: number, lastSeenAt: string) {
    return this.feedRepository.updateLastSeenResource({
      userId,
      lastSeenAt,
    })
  }

  async getLastSeenResource(userId: number) {
    return this.feedRepository.getLastSeenResource(userId)
  }

  async findNewResourcesCount(userId: number) {
    const [lastSeenResource, feedResources] = await Promise.all([
      this.feedRepository.getLastSeenResource(userId),
      this.findFeedResources(userId),
    ])

    const lastSeenAt = lastSeenResource?.lastSeenAt

    const newResources = feedResources.filter((resource) => {
      return resource.completedAt > lastSeenAt
    })

    return newResources.length
  }
}
