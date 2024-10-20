import { NotFoundError } from "routing-controllers"
import { dataSource } from "../../dataSource"
import { newUserInfo } from "../../dtos/UserInfoDto"
import { Profile } from "../../entities/feed/Profile"
import FollowingTagRepository from "../../repositories/feed/FollowingTagRepository"
import TagRepository from "../../repositories/relearn/TagRepository"
import SkillRepository from "../../repositories/skillbase/SkillRepository"
import { UserRepository } from "../../repositories/UserRepository"
import { userToSimpleUserDto } from "../../utils/domain/user/userToSimpleUserDto"
import { FeedRepository } from "../feed/feed/FeedRepository"

export class UserService {
  constructor(
    private readonly userRepo = new UserRepository(),
    private readonly profileRepo = dataSource.getRepository(Profile),
    private readonly tagRepo = TagRepository,
    private readonly followingTagRepo = FollowingTagRepository,
    private readonly skillRepo = SkillRepository,
    private readonly feedRepo = new FeedRepository()
  ) {}

  async getUserInfo(username: string, requesterId: number) {
    const userInfo = newUserInfo()

    // username exists?
    const foundUser = await this.userRepo.rawRepo.findOne({
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
    const users = await this.userRepo.findNewUsers()
    return users.map((user) => userToSimpleUserDto(user))
  }
}
