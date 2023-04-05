import { ForbiddenError, NotFoundError } from "routing-controllers"
import { ResourceRepository } from "./ResourceRepository"

export class ResourceService {
  constructor(private resourceRepo = new ResourceRepository()) {}

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
}
