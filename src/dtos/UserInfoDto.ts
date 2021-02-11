import { Profile } from '../entities/feed/Profile';
import { Resource } from '../entities/relearn/Resource';
import { Tag } from '../entities/relearn/Tag';

export interface UserInfoDto {
    profile: Profile,
    resources: Resource[],

    publicLists: Tag[],
    privateLists: Tag[],
}

export const newUserInfo = (): UserInfoDto => (
    {
        profile: null,
        resources: [],

        publicLists: [],
        privateLists: [],
    }

)