import { EntityRepository, Repository } from 'typeorm';
import { Tag } from '../../entity/relearn/Tag';
import { User } from '../../entity/User';

@EntityRepository(Tag)
export default class TagRepository extends Repository<Tag>{

    async getAllTagsFromUser(user: User): Promise<Tag[]> {
        return this.createQueryBuilder("tag")
            .where({ user })
            .leftJoinAndSelect('tag.resources', 'resources')
            .orderBy("tag.updatedAt", "DESC")
            .getMany()
    }


}