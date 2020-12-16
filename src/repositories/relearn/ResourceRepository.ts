import { EntityRepository, getManager, Repository } from 'typeorm';
import { Resource } from '../../entity/relearn/Resource';
import { Tag } from '../../entity/relearn/Tag';
import { User } from '../../entity/User';

@EntityRepository(Resource)
export default class ResourceRepository extends Repository<Resource>{

    // PE 2/3 
    async getAllResourcesFromUser(user: User): Promise<Resource[]> {
        return this
            .createQueryBuilder("resource")
            .where({ user })
            .leftJoinAndSelect('resource.tag', 'tag')
            .orderBy("resource.createdAt", "DESC")
            .getMany()
    }

    async getLastPosition(tag: Tag, user: User): Promise<number> {
        let lastResource: Resource
        if (tag) {
            lastResource = await this
                .createQueryBuilder('resource')
                .where({ tag })
                .andWhere("resource.position IS NOT NULL")
                .orderBy('resource.position', 'DESC')
                .getOne()
        }
        else {
            lastResource = await this.createQueryBuilder('resource')
                .where({ user })
                .andWhere("resource.tagId IS NULL")
                .andWhere("resource.position IS NOT NULL")
                .orderBy('resource.position', 'DESC')
                .getOne()
        }

        if (lastResource?.position >= 0) {
            return lastResource.position + 1
        }
        return 0
    }

    // reduce by 1 
    async reducePosition(tag: Tag, user: User, startingPosition: Number): Promise<void> {
        if (tag) {
            await getManager().query(`
                UPDATE "resource" 
                   SET "position" = "position" - 1 
                 WHERE "tagId" = $1 
                   AND "position" >= $2`, [tag.id, startingPosition])
        }
        else {
            await getManager().query(`
                UPDATE "resource" 
                   SET "position" = "position" - 1 
                 WHERE "tagId" IS NULL 
                   AND "userId" = $1 
                   AND "position" >= $2`, [user.id, startingPosition])
        }
    }
}