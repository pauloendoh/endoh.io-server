import { Profile } from "../entities/feed/Profile";
import { Resource } from "../entities/relearn/Resource";
import { Tag } from "../entities/relearn/Tag";
import { Skill } from "../entities/skillbase/Skill";
import { FollowerDto } from "./feed/FollowerDto";
import { FollowingUserDto } from "./feed/FollowingUserDto";

export interface UserInfoDto {
  profile: Profile;
  resources: Resource[];

  publicLists: Tag[];
  privateLists: Tag[];

  followingUsers: FollowingUserDto[];
  followers: FollowerDto[];

  publicSkills: Skill[];
}

export const newUserInfo = (partial?: Partial<UserInfoDto>): UserInfoDto => ({
  profile: null,
  resources: [],

  publicLists: [],
  privateLists: [],

  followingUsers: [],
  followers: [],

  publicSkills: [],

  ...partial,
});
