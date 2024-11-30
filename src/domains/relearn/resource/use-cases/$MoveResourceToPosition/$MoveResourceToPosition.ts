import { NotFoundError } from "routing-controllers"
import ResourceRepository from "../../../../../repositories/relearn/ResourceRepository"

export class $MoveResourceToPosition {
  constructor(private readonly resourceRepo = ResourceRepository) {}

  async exec(input: {
    requesterId: number
    resourceId: number
    newPosition: number
  }) {
    const foundResource = await this.resourceRepo.userOwnsResource({
      resourceId: input.resourceId,
      userId: input.requesterId,
    })

    if (!foundResource) {
      throw new NotFoundError("Resource not found or user is not the owner.")
    }

    const resources = await this.resourceRepo.findResourcesByTag(
      foundResource.tagId
    )

    const oldIndex = [...resources]
      .map((resource, index) => ({
        ...resource,
        position: index,
      }))
      .findIndex((resource) => resource.id === foundResource.id)

    if (oldIndex === -1) {
      throw new NotFoundError("Resource not found in the tag.")
    }

    const newIndex = input.newPosition - 1

    resources.splice(oldIndex, 1)

    resources.splice(newIndex, 0, foundResource)

    const newResourcePositions = [...resources].map((resource, index) => ({
      id: resource.id,
      position: index,
    }))

    await this.resourceRepo.updateResourcePositions(newResourcePositions)

    return "OK" as const
  }
}
