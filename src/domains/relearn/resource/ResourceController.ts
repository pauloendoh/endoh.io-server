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
  QueryParam,
} from "routing-controllers"
import { In } from "typeorm"
import { IdsDto } from "../../../dtos/IdsDto"
import { User } from "../../../entities/User"
import { Resource } from "../../../entities/relearn/Resource"
import ResourceRepository from "../../../repositories/relearn/ResourceRepository"
import { ResourceService } from "./ResourceService"
import { _SaveResource } from "./use-cases/_SaveResource/_SaveResource"

@JsonController()
export class ResourceController {
  constructor(
    private resourceRepo = ResourceRepository,
    private service = new ResourceService(),
    private _saveResource = new _SaveResource()
  ) {}

  @Post("/relearn/resource")
  async saveResource(
    @CurrentUser({ required: true })
    user: User,
    @Body() sentResource: Resource,
    @QueryParam("returnAll") returnAll?: boolean
  ) {
    return this._saveResource.exec({
      sentResource,
      user,
      returnAll,
    })
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
    const result = await this.resourceRepo.delete({
      id: resourceId,
      userId: user.id,
    })
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
      where: { id: resourceId, userId: user.id },
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
      id: undefined,
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

  @Post("/move-resource-to-first/:resourceId")
  async moveResourceToFirst(
    @CurrentUser({ required: true }) user: User,
    @Param("resourceId") resourceId: number
  ) {
    return this.service.moveResourceToFirst(resourceId, user.id)
  }

  @Post("/move-resource-to-last/:resourceId")
  async moveResourceToLast(
    @CurrentUser({ required: true }) user: User,
    @Param("resourceId") resourceId: number
  ) {
    return this.service.moveResourceToLast(resourceId, user.id)
  }

  @Post("/scan-urls")
  async scanUrls(
    @CurrentUser({ required: true }) user: User,
    @Body() body: { urls: string[] }
  ) {
    const { urls } = body

    const resources = await this.service.scanUrls({
      urls,
      userId: user.id,
    })

    return resources
  }
}
