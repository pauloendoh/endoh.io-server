import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm"
import { User } from "../User"

@Entity()
export class Follow {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne((_) => User, (user) => user.follows, { onDelete: "CASCADE" })
  @JoinColumn()
  follower: User

  @Column()
  followerId: number

  @ManyToOne((_) => User, (user) => user.followedBy, { onDelete: "CASCADE" })
  @JoinColumn()
  followedUser: User

  @Column()
  followedUserId: number

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
