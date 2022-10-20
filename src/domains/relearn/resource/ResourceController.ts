import {
  BadRequestError,
  Body,
  CurrentUser,
  Delete,
  Get,
  JsonController,
  Param,
  Post,
  Put,
} from "routing-controllers"
import { In } from "typeorm"
import { IdsDto } from "../../../dtos/IdsDto"
import { Resource } from "../../../entities/relearn/Resource"
import { User } from "../../../entities/User"
import ResourceRepository from "../../../repositories/relearn/ResourceRepository"

@JsonController()
export class ResourceController {
  constructor(private resourceRepo = ResourceRepository) {}

  // PE 1/3 - it's getting way too slow
  @Post("/relearn/resource")
  async saveResource(
    @CurrentUser({ required: true })
    user: User,
    @Body() sentResource: Resource
  ) {
    if (sentResource.tag === null)
      throw new BadRequestError("Resource must have a tag.")

    // If updating
    if (sentResource.id) {
      const previousResource = await this.resourceRepo.findOne({
        where: {
          id: sentResource.id,
          user,
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
        sentResource.position = null

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

    await this.resourceRepo.save({ ...sentResource })
    return this.resourceRepo.findAllResourcesFromUser(user)
  }

  @Get("/relearn/resource/")
  async getResources(
    @CurrentUser({ required: true })
    user: User
  ) {
    return this.resourceRepo.findAllResourcesFromUser(user)
  }

  @Delete("/relearn/resource/:id")
  async deleteResource(
    @CurrentUser({ required: true })
    user: User,
    @Param("id") resourceId: number
  ) {
    const result = await this.resourceRepo.delete({ id: resourceId, user })
    if (!result.affected)
      throw new BadRequestError("Resource id not found, or user is not owner.")
    return `Resource ${resourceId} deleted.`
  }

  @Post("/relearn/resource/resources")
  async saveManyResources(
    @CurrentUser({ required: true })
    user: User,
    @Body() sentResources: Resource[]
  ) {
    const verifiedResources = await this.resourceRepo.find({
      where: {
        id: In(sentResources.map((r) => r.id)),
        userId: user.id,
      },
    })
    if (verifiedResources.length !== sentResources.length) {
      throw new BadRequestError("User does not own all sent resources.")
    }

    await this.resourceRepo.save(sentResources)
    return "Saved"
  }

  @Post("/relearn/resource/duplicate/:id")
  async duplicateResource(
    @CurrentUser({ required: true })
    user: User,
    @Param("id") resourceId: number
  ) {
    const foundResource = await this.resourceRepo.findOne({
      where: { id: resourceId, user },
    })

    if (!foundResource)
      throw new BadRequestError("Resource id not found, or user is not owner.")

    if (foundResource.completedAt.length > 0) {
      throw new BadRequestError("Can't duplicate completed resources.")
    }

    // empurra todos após o :id
    await this.resourceRepo.increasePositionByOne(
      foundResource.tagId,
      user,
      foundResource.position + 1
    )

    // insere uma cópia na próxima posição
    await this.resourceRepo.save({
      ...foundResource,
      id: null,
      position: foundResource.position + 1,
      createdAt: undefined,
      updatedAt: undefined,
    })

    // retorna todos os resources
    return this.resourceRepo.findAllResourcesFromUser(user)
  }

  @Put("/v2/resources/many/to-tag")
  async moveManyToTag(
    @CurrentUser({ required: true }) user: User,
    @Body()
    data: {
      resourceIds: number[]
      toTagId: number
    }
  ) {
    await this.resourceRepo.moveResourcesToTag(
      data.resourceIds,
      data.toTagId,
      user.id
    )

    return this.resourceRepo.findAllResourcesFromUser(user)
  }

  @Delete("/v2/resources/many/delete")
  async deleteMany(
    @CurrentUser({ required: true }) user: User,
    @Body()
    body: IdsDto
  ) {
    const { ids } = body

    await this.resourceRepo
      .createQueryBuilder()
      .delete()
      .where("userId = (:userId)", { userId: user.id })
      .andWhereInIds(ids)
      .execute()

    const allResources = await this.resourceRepo.findAllResourcesFromUser(user)
    return allResources
  }
}
