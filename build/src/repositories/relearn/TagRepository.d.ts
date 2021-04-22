import { Repository } from 'typeorm';
import { Tag } from '../../entities/relearn/Tag';
import { User } from '../../entities/User';
export default class TagRepository extends Repository<Tag> {
    getAllTagsFromUser(user: User): Promise<Tag[]>;
}
