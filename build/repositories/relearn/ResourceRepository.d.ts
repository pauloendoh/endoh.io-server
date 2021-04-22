import { Repository } from 'typeorm';
import { Resource } from '../../entities/relearn/Resource';
import { Tag } from '../../entities/relearn/Tag';
import { User } from '../../entities/User';
export default class ResourceRepository extends Repository<Resource> {
    getAllResourcesFromUser(user: User): Promise<Resource[]>;
    getRatedResourcesFromUser(user: User, allResources: boolean): Promise<Resource[]>;
    getLastPosition(tag: Tag, user: User): Promise<number>;
    reducePosition(tag: Tag, user: User, startingPosition: Number): Promise<void>;
    increasePositionByOne(tagId: number, user: User, startingPosition: Number): Promise<void>;
    getResourcesByText(user: User, text: string): Promise<Resource[]>;
}
