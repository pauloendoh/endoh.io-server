import { DateTimeResolver } from "graphql-scalars"

import { Field, ObjectType } from "type-graphql"
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm"
import { User } from "../User"

@Entity()
@ObjectType()
export class Learning {
  @PrimaryGeneratedColumn()
  @Field()
  id: number

  @ManyToOne((type) => User, (user) => user.learnings, { onDelete: "CASCADE" })
  user: User

  @Column()
  @Field()
  userId: number

  @Column({ default: "" })
  @Field()
  description: string

  @Column({ default: false })
  @Field()
  isHighlight: boolean

  @Column({ default: 1, type: "decimal", precision: 5, scale: 2 })
  @Field()
  points: number

  @CreateDateColumn()
  @Field(() => DateTimeResolver)
  datetime: string

  @CreateDateColumn()
  @Field(() => DateTimeResolver)
  createdAt: string

  @UpdateDateColumn()
  @Field(() => DateTimeResolver)
  updatedAt: string
}
