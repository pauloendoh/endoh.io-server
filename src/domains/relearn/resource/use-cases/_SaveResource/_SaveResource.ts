import { BadRequestError } from "routing-controllers"
import { User } from "../../../../../entities/User"
import { Resource } from "../../../../../entities/relearn/Resource"
import ResourceRepository from "../../../../../repositories/relearn/ResourceRepository"

export class _SaveResource {
  constructor(private resourceRepo = ResourceRepository) {}

  async exec(params: {
    sentResource: Resource
    user: User
    returnAll?: boolean
  }) {
    const { sentResource, user, returnAll = true } = params
    if (sentResource.tag === null)
      throw new BadRequestError("Resource must have a tag.")

    if (sentResource.thumbnail === null) sentResource.thumbnail = ""

    // If updating
    if (sentResource.id) {
      const previousResource = await this.resourceRepo.findOne({
        where: {
          id: sentResource.id,
          userId: user.id,
        },
        relations: {
          tag: true,
        },
      })

      // Check ownership
      if (!previousResource) {
        throw new BadRequestError("User does not own this resource.")
      }

      // if updating a rating
      if (
        previousResource.rating !== sentResource.rating &&
        sentResource.rating > 0
      )
        sentResource.completedAt = new Date().toISOString()

      // PE 1/3 - Maybe it would be better to create a specific route for that...
      // If adding a rating
      if (!previousResource.rating && sentResource.rating > 0) {
        await this.resourceRepo.reducePosition(
          sentResource.tag,
          user,
          sentResource.position + 1
        )

        sentResource.completedAt = new Date().toISOString()
        // sentResource.position = null

        // TODO: reduce by 1 the others' positions
      }
      // If removing a rating
      else if (previousResource.rating > 0 && sentResource.rating === null) {
        sentResource.completedAt = ""
        sentResource.position = await this.resourceRepo.getLastPosition(
          sentResource.tag,
          user
        )
      }

      if (
        ((previousResource.tag === null && sentResource.tag !== null) || // adding tag
          (previousResource.tag !== null && sentResource.tag === null) || // removing tag
          previousResource.tag?.id != sentResource.tag?.id) && // changing tag
        previousResource.position
      ) {
        await this.resourceRepo.reducePosition(
          previousResource.tag,
          user,
          previousResource.position + 1
        )

        sentResource.position = await this.resourceRepo.getLastPosition(
          sentResource.tag,
          user
        )
      }
    } else {
      // if adding resource, check tag's last resource's position
      sentResource.position = await this.resourceRepo.getLastPosition(
        sentResource.tag,
        user
      )
      sentResource.userId = user.id
    }

    const saved = await this.resourceRepo.save({ ...sentResource })
    if (returnAll) {
      return this.resourceRepo.findAllResourcesFromUser(user)
    }

    return saved
  }
}
