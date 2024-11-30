import { FindOptionsWhere, In } from "typeorm"
import { dataSource } from "../../dataSource"
import { User } from "../../entities/User"
import { Resource } from "../../entities/relearn/Resource"
import { Tag } from "../../entities/relearn/Tag"
import { myConsoleSuccess } from "../../utils/myConsoleSuccess"

const ResourceRepository = dataSource.getRepository(Resource).extend({
  async userOwnsResource(input: {
    userId: number
    resourceId: number
  }): Promise<Resource | null> {
    const { userId, resourceId } = input
    return this.findOne({
      where: {
        id: resourceId,
        userId: userId,
      },
    })
  },

  async findAllResourcesFromUser(user: User): Promise<Resource[]> {
    return this.createQueryBuilder("resource")
      .where({ user })
      .leftJoinAndSelect("resource.tag", "tag")
      .orderBy("resource.position", "ASC")
      .getMany()
  },
  async findResourcesByTag(tagId: number) {
    return this.find({ where: { tagId }, order: { position: "ASC" } })
  },
  async findOneRelationsId(where: FindOptionsWhere<Resource>) {
    return this.findOne({ where, relations: { tag: true } })
  },
  async updateResourcePositions(
    resources: {
      id: number
      position: number
    }[]
  ) {
    return this.manager.transaction(async (manager) => {
      for (const resource of resources) {
        await manager.update(Resource, resource.id, {
          position: resource.position,
        })
      }
    })
  },

  // PE 2/3
  async getRatedResourcesFromUser(
    user: User,
    allResources: boolean
  ): Promise<Resource[]> {
    if (allResources) {
      // request user is owner
      return this.createQueryBuilder("resource")
        .leftJoinAndSelect("resource.tag", "tag")
        .where({ user })
        .andWhere("resource.rating > 0")
        .andWhere('resource."tagId" is not null')
        .orderBy("resource.completedAt", "DESC")
        .getMany()
    } else {
      const resources = await this.createQueryBuilder("resource")
        .leftJoinAndSelect("resource.tag", "tag")
        .where({ user })
        .andWhere("resource.rating > 0")
        .andWhere('resource."tagId" is not null')
        .andWhere('tag."isPrivate" is false') // get only the public resources (from public tags, that is)
        .orderBy("resource.completedAt", "DESC")
        .getMany()

      // remover o campo privateNote se usuario não for dono
      return resources.map((resource) => ({
        ...resource,
        privateNote: "",
      }))
    }
  },

  async getLastPosition(tag: Tag, user: User): Promise<number> {
    let lastResource: Resource | null
    if (tag) {
      lastResource = await this.createQueryBuilder("resource")
        .where({ tag })
        .andWhere("resource.position IS NOT NULL")
        .orderBy("resource.position", "DESC")
        .getOne()
    } else {
      lastResource = await this.createQueryBuilder("resource")
        .where({ user })
        .andWhere("resource.tagId IS NULL")
        .andWhere("resource.position IS NOT NULL")
        .orderBy("resource.position", "DESC")
        .getOne()
    }

    if (lastResource && lastResource.position >= 0) {
      return lastResource.position + 1
    }
    return 0
  },

  async decrementResourcePositionsInTag(params: {
    tag: Tag
    user: User
    startingPosition: number
  }): Promise<void> {
    const { tag, user, startingPosition } = params

    if (tag) {
      await dataSource.query(
        `
                UPDATE "resource" 
                   SET "position" = "position" - 1 
                 WHERE "tagId" = $1 
                   AND "position" >= $2`,
        [tag.id, startingPosition]
      )
    } else {
      await dataSource.query(
        `
                UPDATE "resource" 
                   SET "position" = "position" - 1 
                 WHERE "tagId" IS NULL 
                   AND "userId" = $1 
                   AND "position" >= $2`,
        [user.id, startingPosition]
      )
    }
  },

  // reduce by 1
  async increasePositionByOne(
    tagId: number,
    user: User,
    startingPosition: Number
  ): Promise<void> {
    if (tagId) {
      await dataSource.query(
        `
                UPDATE "resource" 
                   SET "position" = "position" + 1 
                 WHERE "tagId" = $1 
                   AND "position" >= $2`,
        [tagId, startingPosition]
      )
    } else {
      await dataSource.query(
        `
                UPDATE "resource" 
                   SET "position" = "position" + 1 
                 WHERE "tagId" IS NULL 
                   AND "userId" = $1 
                   AND "position" >= $2`,
        [user.id, startingPosition]
      )
    }
  },

  // PE 2/3
  async getResourcesByText(user: User, text: string): Promise<Resource[]> {
    const words = text.split(" ")

    let query = this.createQueryBuilder("resource").where({ user })

    // multi word search
    words.forEach((word, index) => {
      // https://github.com/typeorm/typeorm/issues/3119
      query = query.andWhere(
        `(unaccent(resource.title) ilike unaccent(:text${index}) 
                 or unaccent(resource.url) ilike unaccent(:text${index})
                 or unaccent(resource."publicReview") ilike unaccent(:text${index}) 
                 or unaccent(resource."privateNote") ilike unaccent(:text${index}))`,
        {
          [`text${index}`]: `%${word}%`,
        }
      )
    })

    query = query
      .leftJoinAndSelect("resource.tag", "tag")
      .orderBy("resource.rating", "DESC")
      .addOrderBy("resource.completedAt", "DESC")

    return query.getMany()
  },

  async createResourcesForNewUser(
    user: User,
    tags: Tag[]
  ): Promise<Resource[]> {
    const programmingTag = tags[0]
    const softSkillsTag = tags[1]

    const resources: Resource[] = []
    resources.push(
      await this.save({
        user,
        tag: programmingTag,
        title: "The Web Developer Bootcamp: Learn HTML, CSS, Node, and More!",
        url: "https://www.udemy.com/course/the-web-developer-bootcamp/",
        thumbnail:
          "https://img-c.udemycdn.com/course/480x270/625204_436a_3.jpg?Expires=1623787808&Signature=QjktuAci5HJkMxcGnUQx~mJTVsOGVeHm3TGn24vPZMLrnW8SMRT-yQ50KOyASfEuZjXIB6K9-nIfqR8GHSIoYj4TZIzx2k1zKy56-ZlBuk-UL7TkBdgE5MHhxvchGpsWxo7EJWQfkGKQZi-5Qgf3XiP2-zq4v~SGT-WqbdEikMjzpAfWJakcQw5WCqyzx7mkwFJZ1c8mblvsaY4tEGxuvL0tCZUD1JvNH856LfsoUs5VkHsMQn7a6cLj6MHN8li8BikIftzzMUXQWPJOQLdsm7pQkuIS~XxpYrvtfUDKPsWNTkkt-s~Gj5mC4MVxFn5azyzWv-RyOmJKqaF-TkUOVQ__&Key-Pair-Id=APKAITJV77WS5ZT7262A",
        estimatedTime: "00:00h",
        position: 0,
      })
    )

    resources.push(
      await this.save({
        user,
        tag: programmingTag,
        title: "Learn Programming FAST! My Favorite Method!",
        url: "https://www.youtube.com/watch?v=Mj3QejzYZ70",
        thumbnail: "https://i.ytimg.com/vi/Mj3QejzYZ70/maxresdefault.jpg",
        estimatedTime: "00:10h",
        position: 1,
      })
    )

    resources.push(
      await this.save({
        user,
        tag: programmingTag,
        title: "Do a personal website project",
        estimatedTime: "00:00h",
        position: 2,
        privateNote: `1. Think about your website \n2. Prototype your website using Figma \n3. Program your site with HTML, CSS and JS`,
      })
    )

    resources.push(
      await this.save({
        user,
        tag: softSkillsTag,
        title: "Rick Astley - Never Gonna Give You Up (Video)",
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        thumbnail: "https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
        estimatedTime: "00:03h",
        position: 0,
      })
    )

    return resources
  },

  // This is used when the drag and drop gets messed up
  async resetRatingsWhereCompletedAtIsNull(): Promise<void> {
    await dataSource.query(
      `UPDATE resource r 
          SET rating = null 
        WHERE "completedAt" = '' 
          AND rating > 0`
    )
    myConsoleSuccess("resetRatingsWhereCompletedAtIsNull() completed")
  },

  async moveResourcesToTag(
    resourceIds: number[],
    tagId: number,
    userId: number
  ) {
    return this.createQueryBuilder()
      .update()
      .set({
        tagId,
      })
      .where({
        id: In(resourceIds),
        userId: userId,
      })
      .execute()
  },

  async fullTextSearch(userId: number, query: string) {
    const resources = await this.createQueryBuilder()
      .select()
      .where("document_with_weights @@ plainto_tsquery(:query)", { query })
      .andWhere('"userId" = :userId', { userId })
      .orderBy(
        "ts_rank(document_with_weights, plainto_tsquery(:query))",
        "DESC"
      )
      .getMany()
    return resources
  },
})

export default ResourceRepository
