import { In } from "typeorm"
import { dataSource } from "../../../dataSource"
import { Resource } from "../../../entities/relearn/Resource"

export class ResourceRepository {
  constructor(
    private db = dataSource,
    private repo = dataSource.getRepository(Resource)
  ) {}

  async userOwnsResource(resourceId: number, userId: number) {
    const resource = await this.repo.findOne({
      where: {
        id: resourceId,
        userId: userId,
      },
    })

    return resource !== undefined
  }

  async findById(id: number) {
    return this.repo.findOne({
      where: {
        id,
      },
    })
  }

  async findResourcesByTagId(tagId: number) {
    return this.repo.find({
      where: {
        tag: {
          id: tagId,
        },
      },
    })
  }

  async updateManyResources(resources: Resource[], requesterId: number) {
    const ids = resources.map((r) => r.id)
    const resourcesToUpdate = await this.repo.find({
      where: {
        id: In(ids),
        userId: requesterId,
      },
    })

    if (resourcesToUpdate.length !== ids.length) {
      throw new Error("User does not own all resources.")
    }

    const updatedResources = await this.repo.save(resources)

    return this.db
      .createQueryBuilder(Resource, "resource")
      .where({ userId: requesterId, id: In(updatedResources.map((r) => r.id)) })
      .leftJoinAndSelect("resource.tag", "tag")
      .orderBy("resource.position", "ASC")
      .getMany()
  }

  async findByUrlsAndUser(params: { urls: string[]; userId: number }) {
    const resources = await this.repo.find({
      where: {
        userId: params.userId,
        url: In(params.urls),
      },
    })

    return resources
  }
}
