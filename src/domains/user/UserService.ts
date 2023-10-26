import { NotFoundError } from "routing-controllers"
import { dataSource } from "../../dataSource"
import { newUserInfo } from "../../dtos/UserInfoDto"
import { Profile } from "../../entities/feed/Profile"
import UserRepository from "../../repositories/UserRepository"
import FollowingTagRepository from "../../repositories/feed/FollowingTagRepository"
import ResourceRepository from "../../repositories/relearn/ResourceRepository"
import TagRepository from "../../repositories/relearn/TagRepository"
import SkillRepository from "../../repositories/skillbase/SkillRepository"
import { userToSimpleUserDto } from "../../utils/domain/user/userToSimpleUserDto"
import { FeedRepository } from "../feed/feed/FeedRepository"
import { UserRepositoryV2 } from "./UserRepositoryV2"

export class UserService {
  constructor(
    private userRepo = UserRepository,
    private resourceRepo = ResourceRepository,
    private profileRepo = dataSource.getRepository(Profile),
    private tagRepo = TagRepository,
    private followingTagRepo = FollowingTagRepository,
    private skillRepo = SkillRepository,
    private feedRepo = new FeedRepository(),
    private userRepoV2 = new UserRepositoryV2()
  ) {}

  async getUserInfo(username: string, requesterId: number) {
    const userInfo = newUserInfo()

    // username exists?
    const foundUser = await this.userRepo.findOne({
      where: {
        username,
      },
    })
    if (!foundUser) throw new NotFoundError("User not found.")

    // get all resources (if req.user === user); otherwise, just get from public lists
    const tags =
      foundUser.id === requesterId
        ? await this.feedRepo.findAllTagsFromUserIds([foundUser.id])
        : await this.feedRepo.findPublicTagsFromUserIds([foundUser.id])

    const tagIds = tags.map((tag) => tag.id)

    const [completedResources, bookmarkedResources] = await Promise.all([
      this.feedRepo.findCompletedResourcesByTagIds(tagIds),
      this.feedRepo.findBookmarkedResourcesByTagIds(tagIds),
    ])

    userInfo.resources = [...completedResources, ...bookmarkedResources]

    // profile
    userInfo.profile = await this.profileRepo.findOne({
      where: {
        userId: foundUser.id,
      },
    })

    // public lists
    userInfo.publicLists = await this.tagRepo.find({
      where: {
        userId: foundUser.id,
        isPrivate: false,
      },
    })

    // private tags
    if (foundUser.id === requesterId) {
      userInfo.privateLists = await this.tagRepo.find({
        where: {
          userId: foundUser.id,
          isPrivate: true,
        },
      })
    }

    userInfo.followingUsers = await this.followingTagRepo.getFollowingUsers(
      foundUser
    )
    userInfo.followers = await this.followingTagRepo.getFollowers(foundUser)

    userInfo.publicSkills = await this.skillRepo.findPublicSkillsFromUser(
      foundUser.id
    )

    return userInfo
  }

  async findNewUsers() {
    const users = await this.userRepoV2.findNewUsers()
    return users.map((user) => userToSimpleUserDto(user))
  }
}
