import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  type Relation,
} from "typeorm"
import { User } from "../User"

@Entity()
export class Follow {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne((_) => User, (user) => user.follows, { onDelete: "CASCADE" })
  @JoinColumn()
  follower: Relation<User>

  @Column()
  followerId: number

  @ManyToOne((_) => User, (user) => user.followedBy, { onDelete: "CASCADE" })
  @JoinColumn()
  followedUser: Relation<User>

  @Column()
  followedUserId: number

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
