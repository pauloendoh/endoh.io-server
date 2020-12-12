import { EntityRepository, Repository } from 'typeorm';
import { Resource } from '../../entity/relearn/Resource';
import { User } from '../../entity/User';

@EntityRepository(Resource)
export default class ResourceRepository extends Repository<Resource>{

    async getAllResourcesFromUser(user: User): Promise<Resource[]> {
        return this.createQueryBuilder("resource")
            .where({ user })
            .leftJoinAndSelect('resource.tag', 'tag')
            .orderBy("resource.createdAt", "DESC")
            .getMany()
    }


}