import { ObjectType } from "type-graphql"
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
export class RecurrentLearning {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne((_) => User, (user) => user.recurrentLearnings, {
    onDelete: "CASCADE",
  })
  user: User

  @Column()
  userId: number

  @Column({ default: "" })
  description: string

  @Column({ default: 1, type: "decimal", precision: 5, scale: 2 })
  points: number

  @CreateDateColumn()
  createdAt: string

  @UpdateDateColumn()
  updatedAt: string
}
