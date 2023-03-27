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
import { Doc } from "./define/Doc"
import { Note } from "./define/Note"
import { FollowingTag } from "./feed/FollowingTag"
import { Notification } from "./feed/Notification"
import { Profile } from "./feed/Profile"
import { UserSuggestion } from "./feed/UserSuggestion"
import { Learning } from "./learning-diary/Learning"
import { ChampionRadar } from "./LolRates/ChampionRadar"
import { Player } from "./LolRates/Player"
import { UserAramChampion } from "./LolRates/UserAramChampion"
import Category from "./monerate/Category"
import { Expense } from "./monerate/Expense"
import Place from "./monerate/Place"
import { UserToken } from "./OAuthToken"
import { DragContainer } from "./playground/DragContainer"
import { DragItem } from "./playground/DragItem"
import { File } from "./playground/file-system/File"
import { Folder } from "./playground/file-system/Folder"
import { Friend } from "./playground/Friend"
import { Tag } from "./relearn/Tag"
import { Label } from "./skillbase/Label"
import { Skill } from "./skillbase/Skill"
import { SkillExpectation } from "./skillbase/SkillExpectation"
import { SkillHistory } from "./skillbase/SkillHistory"
import { SkillProgress } from "./skillbase/SkillProgress"
import { Test } from "./Test"
import { UserGotIt } from "./UserGotIt"
import { UserPreference } from "./UserPreference"

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
  expiresAt: string

  // Relations ----------------------------------------------------------------
  @OneToOne((type) => UserPreference, (preference) => preference.user, {
    eager: true,
  })
  preference: UserPreference

  @OneToOne((type) => UserGotIt, (userGotIt) => userGotIt.user)
  gotIt: UserGotIt

  @OneToOne((type) => Profile, (profile) => profile.user)
  profile: Profile

  @OneToMany((type) => Expense, (expense) => expense.user)
  expenses: Expense[]

  @OneToMany((type) => Learning, (learning) => learning.user)
  learnings: Learning[]

  @OneToMany((type) => Category, (category) => category.user)
  categories: Category[]

  @OneToMany((type) => Place, (place) => place.user)
  places: Place[]

  @OneToMany((type) => UserToken, (oauthToken) => oauthToken.user)
  tokens: UserToken[]

  @OneToMany((type) => Tag, (tag) => tag.user)
  tags: Tag[]

  // Skillbase
  @OneToMany((type) => Skill, (skill) => skill.user)
  skills: Skill[]

  @OneToMany(() => SkillHistory, (skillHistory) => skillHistory.user)
  skillHistories: SkillHistory[]

  @OneToMany((type) => Label, (label) => label.user)
  labels: Label[]

  @OneToMany(
    (type) => SkillExpectation,
    (skillExpectation) => skillExpectation.user
  )
  skillExpectations: SkillExpectation[]

  @OneToMany((type) => SkillProgress, (progress) => progress.user)
  skillProgresses: SkillProgress[]

  // Feed
  @OneToMany((type) => FollowingTag, (followingTag) => followingTag.follower)
  followingTags: FollowingTag[]

  @OneToMany(
    (type) => FollowingTag,
    (followingTag) => followingTag.followingUser
  )
  followerTags: FollowingTag[]

  @OneToMany((type) => UserSuggestion, (userSuggestion) => userSuggestion.user)
  userSuggestions: UserSuggestion[]

  @OneToMany(
    (type) => UserSuggestion,
    (userSuggestion) => userSuggestion.suggestedUser
  )
  suggestedBy: UserSuggestion[]

  @OneToMany((type) => Notification, (notification) => notification.user)
  notifications: Notification[]

  @OneToMany((type) => Notification, (notification) => notification.follower)
  followingNotifications: Notification[]

  // Define
  @OneToMany(() => Doc, (doc) => doc.user)
  docs: Doc[]

  @OneToMany(() => Note, (note) => note.user)
  notes: Note[]

  // BigDecisions
  @OneToMany(() => Decision, (decision) => decision.user)
  decisions: Decision[]

  @OneToMany(() => DecisionTable, (table) => table.user)
  decisionTables: DecisionTable[]

  @OneToMany(() => DecisionTableItem, (item) => item.user)
  decisionTableItems: DecisionTableItem[]

  // lolrates
  @OneToMany((type) => Player, (player) => player.user)
  players: Player[]

  @OneToMany((type) => ChampionRadar, (cRadar) => cRadar.user)
  championRadars: ChampionRadar[]

  @OneToMany((type) => Test, (test) => test.user)
  tests: Test[]

  @OneToMany((type) => DragContainer, (dragContainer) => dragContainer.user)
  dragContainers: DragContainer[]

  @OneToMany((type) => DragItem, (dragItem) => dragItem.user)
  dragItems: DragItem[]

  @OneToMany((type) => Folder, (folder) => folder.user)
  folders: Folder[]

  @OneToMany((type) => File, (file) => file.user)
  files: File[]

  @OneToMany((type) => Friend, (friend) => friend.user)
  friends: Friend[]

  @OneToMany((type) => UserAramChampion, (aramChampion) => aramChampion.user)
  aramChampions: UserAramChampion[]
}
