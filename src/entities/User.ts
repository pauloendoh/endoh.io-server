import {
  AfterInsert,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  getRepository,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm"
import { Doc } from "./define/Doc"
import { Note } from "./define/Note"
import { FollowingTag } from "./feed/FollowingTag"
import { Notification } from "./feed/Notification"
import { Profile } from "./feed/Profile"
import { UserSuggestion } from "./feed/UserSuggestion"
import Category from "./monerate/Category"
import { Expense } from "./monerate/Expense"
import Place from "./monerate/Place"
import { UserToken } from "./OAuthToken"
import { Tag } from "./relearn/Tag"
import { Skill } from "./skillbase/Skill"
import { SkillExpectation } from "./skillbase/SkillExpectation"
import { SkillProgress } from "./skillbase/SkillProgress"
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

  @OneToOne((type) => Profile, (profile) => profile.user)
  profile: Profile

  @OneToMany((type) => Expense, (expense) => expense.user)
  expenses: Expense[]

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
}
