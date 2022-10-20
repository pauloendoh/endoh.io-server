import { Arg, Query, Resolver } from "type-graphql"
import { dataSource } from "../dataSource"
import { Resource } from "../entities/relearn/Resource"

@Resolver()
export class ResourceResolver {
  @Query(() => [Resource])
  async findResources(@Arg("userId", { nullable: true }) userId: number) {
    let resources = await dataSource.getRepository(Resource).find()

    if (userId) resources = resources.filter((r) => r.userId === userId)

    return resources
  }
}
