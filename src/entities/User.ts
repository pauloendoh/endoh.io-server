import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm"
import { Decision } from "./BigDecisions/Decision"
import { DecisionTable } from "./BigDecisions/DecisionTable"
import { DecisionTableItem } from "./BigDecisions/DecisionTableItem"
import { ChampionRadar } from "./LolRates/ChampionRadar"
import { Player } from "./LolRates/Player"
import { UserAramChampion } from "./LolRates/UserAramChampion"
import { MalUser } from "./MAL/MalUser"
import { UserToken } from "./OAuthToken"
import { Test } from "./Test"
import { UserGotIt } from "./UserGotIt"
import { UserPreference } from "./UserPreference"
import { Doc } from "./define/Doc"
import { Question } from "./define/Question"
import { Follow } from "./feed/Follow"
import { FollowingTag } from "./feed/FollowingTag"
import { LastSeenResource } from "./feed/LastSeenResource"
import { Notification } from "./feed/Notification"
import { Profile } from "./feed/Profile"
import { UserSuggestion } from "./feed/UserSuggestion"
import { Learning } from "./learning-diary/Learning"
import { RecurrentLearning } from "./learning-diary/RecurrentLearning"
import Category from "./monerate/Category"
import { Expense } from "./monerate/Expense"
import Place from "./monerate/Place"
import { DragContainer } from "./playground/DragContainer"
import { DragItem } from "./playground/DragItem"
import { Friend } from "./playground/Friend"
import { File } from "./playground/file-system/File"
import { Folder } from "./playground/file-system/Folder"
import { Tag } from "./relearn/Tag"
import { Label } from "./skillbase/Label"
import { Skill } from "./skillbase/Skill"
import { SkillExpectation } from "./skillbase/SkillExpectation"
import { SkillHistory } from "./skillbase/SkillHistory"
import { SkillProgress } from "./skillbase/SkillProgress"

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true, nullable: true })
  googleId: string

  @Column({ unique: true })
  username: string

  @Column({ unique: true })
  email: string

  @Column()
  password: string

  @Column({ default: false })
  isAdmin: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @Column({ type: "timestamptz", nullable: true })
  expiresAt: string | null

  // Relations ----------------------------------------------------------------
  @OneToOne((_) => UserPreference, (preference) => preference.user, {
    eager: true,
  })
  preference: UserPreference

  @OneToOne((_) => UserGotIt, (userGotIt) => userGotIt.user)
  gotIt: UserGotIt

  @OneToOne((_) => Profile, (profile) => profile.user)
  profile: Profile

  @OneToMany((_) => Expense, (expense) => expense.user)
  expenses: Expense[]

  @OneToMany((_) => Learning, (learning) => learning.user)
  learnings: Learning[]

  @OneToMany(
    (_) => RecurrentLearning,
    (recurrentLearning) => recurrentLearning.user
  )
  recurrentLearnings: RecurrentLearning[]

  @OneToMany((_) => Category, (category) => category.user)
  categories: Category[]

  @OneToMany((_) => Place, (place) => place.user)
  places: Place[]

  @OneToMany((_) => UserToken, (oauthToken) => oauthToken.user)
  tokens: UserToken[]

  @OneToMany((_) => Tag, (tag) => tag.user)
  tags: Tag[]

  // Skillbase
  @OneToMany((_) => Skill, (skill) => skill.user)
  skills: Skill[]

  @OneToMany((_) => SkillHistory, (skillHistory) => skillHistory.user)
  skillHistories: SkillHistory[]

  @OneToMany((_) => Label, (label) => label.user)
  labels: Label[]

  @OneToMany(
    (_) => SkillExpectation,
    (skillExpectation) => skillExpectation.user
  )
  skillExpectations: SkillExpectation[]

  @OneToMany((_) => SkillProgress, (progress) => progress.user)
  skillProgresses: SkillProgress[]

  // Feed
  @OneToMany((_) => FollowingTag, (followingTag) => followingTag.follower)
  followingTags: FollowingTag[]

  @OneToMany((_) => Follow, (follow) => follow.follower)
  follows: Follow[]

  @OneToMany((_) => Follow, (follow) => follow.followedUser)
  followedBy: Follow[]

  @OneToMany((_) => FollowingTag, (followingTag) => followingTag.followingUser)
  followerTags: FollowingTag[]

  @OneToMany((_) => UserSuggestion, (userSuggestion) => userSuggestion.user)
  userSuggestions: UserSuggestion[]

  @OneToMany(
    (_) => UserSuggestion,
    (userSuggestion) => userSuggestion.suggestedUser
  )
  suggestedBy: UserSuggestion[]

  @OneToMany((_) => Notification, (notification) => notification.user)
  notifications: Notification[]

  @OneToMany((_) => Notification, (notification) => notification.follower)
  followingNotifications: Notification[]

  @OneToOne(
    (_) => LastSeenResource,
    (lastSeenResource) => lastSeenResource.user
  )
  lastSeenResource: LastSeenResource

  // Define
  @OneToMany((_) => Doc, (doc) => doc.user)
  docs: Doc[]

  @OneToMany((_) => Question, (question) => question.user)
  questions: Question[]

  // BigDecisions
  @OneToMany((_) => Decision, (decision) => decision.user)
  decisions: Decision[]

  @OneToMany((_) => DecisionTable, (table) => table.user)
  decisionTables: DecisionTable[]

  @OneToMany((_) => DecisionTableItem, (item) => item.user)
  decisionTableItems: DecisionTableItem[]

  // lolrates
  @OneToMany((_) => Player, (player) => player.user)
  players: Player[]

  @OneToMany((_) => ChampionRadar, (cRadar) => cRadar.user)
  championRadars: ChampionRadar[]

  @OneToMany((_) => Test, (test) => test.user)
  tests: Test[]

  @OneToMany((_) => DragContainer, (dragContainer) => dragContainer.user)
  dragContainers: DragContainer[]

  @OneToMany((_) => DragItem, (dragItem) => dragItem.user)
  dragItems: DragItem[]

  @OneToMany((_) => Folder, (folder) => folder.user)
  folders: Folder[]

  @OneToMany((_) => File, (file) => file.user)
  files: File[]

  @OneToMany((_) => Friend, (friend) => friend.user)
  friends: Friend[]

  @OneToMany((_) => UserAramChampion, (aramChampion) => aramChampion.user)
  aramChampions: UserAramChampion[]

  @OneToOne((_) => MalUser, (malUser) => malUser.user, { nullable: true })
  malUser: MalUser | null
}
