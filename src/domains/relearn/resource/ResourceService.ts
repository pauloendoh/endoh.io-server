import { ForbiddenError, NotFoundError } from "routing-controllers"
import { $GetYoutubeVideoId } from "../../../resolvers/utils/LinkPreview/use-cases/$GetYoutubeVideoId"
import { ResourceRepository } from "./ResourceRepository"

export class ResourceService {
  constructor(
    private resourceRepo = new ResourceRepository(),
    private $getYoutubeVideoId = new $GetYoutubeVideoId()
  ) {}

  async moveResourceToFirst(resourceId: number, requesterId: number) {
    const isAllowed = await this.resourceRepo.userOwnsResource(
      resourceId,
      requesterId
    )

    if (!isAllowed) throw new ForbiddenError("User does not own this resource.")

    const foundResource = await this.resourceRepo.findById(resourceId)
    if (!foundResource) throw new NotFoundError("Resource does not exist.")

    if (foundResource.completedAt) {
      throw new ForbiddenError("Cannot move completed resource.")
    }

    const tagResources = await this.resourceRepo.findResourcesByTagId(
      foundResource.tagId
    )

    const resource = tagResources.find((r) => r.id === resourceId)
    if (!resource) {
      throw new NotFoundError("Resource does not exist.")
    }

    resource.position = 0

    const sortedResources = tagResources
      .filter((r) => !r.completedAt)
      .sort(
        // asc
        (a, b) => a.position - b.position
      )

    const resourcesToUpdate = sortedResources.map((r, i) => ({
      ...r,
      position: i + 1,
    }))

    const updated = await this.resourceRepo.updateManyResources(
      resourcesToUpdate,
      requesterId
    )

    return updated
  }

  async moveResourceToLast(resourceId: number, requesterId: number) {
    const isAllowed = await this.resourceRepo.userOwnsResource(
      resourceId,
      requesterId
    )

    if (!isAllowed) throw new ForbiddenError("User does not own this resource.")

    const foundResource = await this.resourceRepo.findById(resourceId)
    if (!foundResource) throw new NotFoundError("Resource does not exist.")

    if (foundResource.completedAt) {
      throw new ForbiddenError("Cannot move completed resource.")
    }

    const tagResources = await this.resourceRepo.findResourcesByTagId(
      foundResource.tagId
    )

    const resource = tagResources.find((r) => r.id === resourceId)
    if (!resource) {
      throw new NotFoundError("Resource does not exist.")
    }
    resource.position = tagResources.length + 1

    const sortedResources = tagResources
      .filter((r) => !r.completedAt)
      .sort(
        // asc
        (a, b) => a.position - b.position
      )

    const resourcesToUpdate = sortedResources.map((r, i) => ({
      ...r,
      position: i + 1,
    }))

    const updated = await this.resourceRepo.updateManyResources(
      resourcesToUpdate,
      requesterId
    )

    return updated
  }

  async scanUrls(params: { urls: string[]; userId: number }) {
    params.urls = params.urls.map((url) => {
      if (url.includes("youtube.com?watch=") || url.includes("youtu.be/")) {
        return `https://www.youtube.com/watch?v=${this.$getYoutubeVideoId.exec(
          url
        )}`
      }
      return url
    })

    const resources = await this.resourceRepo.findByUrlsAndUser(params)

    return params.urls.map((url) => {
      const foundResource = resources.find((r) => r.url === url)
      return {
        url,
        resource: foundResource || null,
      }
    })
  }
}
