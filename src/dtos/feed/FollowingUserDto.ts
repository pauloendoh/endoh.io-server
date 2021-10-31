import { Tag } from "../../entities/relearn/Tag";

// PE 2/3 - change to UserFollowingTagsDto[]
export interface FollowingUserDto {
  followingUser: {
    userId: number;
    username: string;
    fullName: string;
    pictureUrl: string;
  };
  tags: Tag[];
}
