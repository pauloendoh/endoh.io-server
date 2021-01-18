import { EntityRepository, Repository } from 'typeorm';
import { Tag } from '../../entities/relearn/Tag';
import { User } from '../../entities/User';

@EntityRepository(Tag)
export default class TagRepository extends Repository<Tag>{

    // PE 2/3 
    async getAllTagsFromUser(user: User): Promise<Tag[]> {
        return this
            .createQueryBuilder("tag")
            .where({ user })
            .leftJoinAndSelect('tag.resources', 'resources')
            .orderBy("tag.createdAt", "ASC")
            .getMany()
    }


}