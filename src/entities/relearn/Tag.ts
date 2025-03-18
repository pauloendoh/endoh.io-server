import { DateTimeResolver } from "graphql-scalars"
import { Field } from "type-graphql"
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm"
import { FollowingTag } from "../feed/FollowingTag"
import { Skill } from "../skillbase/Skill"
import { User } from "../User"
import { Resource } from "./Resource"

enum SortingBy {
  default = "default",
  priority = "priority",
}

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  @Field()
  id: number

  @ManyToOne((type) => User, (user) => user.tags, { onDelete: "CASCADE" })
  user: User

  @Column()
  @Field()
  userId: number

  @OneToMany((type) => Resource, (resource) => resource.tag)
  resources: Resource[]

  @OneToMany((type) => Skill, (skill) => skill.tag)
  skills: Skill[]

  @OneToMany((type) => FollowingTag, (tagFollower) => tagFollower.tag)
  tagFollowers: FollowingTag[]

  @Column()
  @Field()
  name: string

  @Column({ nullable: true })
  @Field({ nullable: true })
  position: number

  @Column({ default: "#ffffff" })
  @Field()
  color: string

  @Column({ default: false })
  @Field()
  isPrivate: boolean

  @Column({
    type: "enum",
    enum: SortingBy,
    default: SortingBy.default,
  })
  @Field()
  sortingBy: SortingBy

  @CreateDateColumn()
  @Field(() => DateTimeResolver)
  createdAt: string

  @UpdateDateColumn()
  @Field(() => DateTimeResolver)
  updatedAt: string

  @Column({ type: "timestamp without time zone", nullable: true })
  @Field(() => DateTimeResolver, { nullable: true })
  lastOpenedAt: string
}
