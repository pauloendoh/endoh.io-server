import {
  AfterUpdate,
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm"
import { User } from "../User"
import { Tag } from "./Tag"

@Entity()
export class Resource {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne((type) => User, (user) => user.expenses, { onDelete: "CASCADE" })
  user: User

  @Column()
  userId: number

  @Column({ default: "" })
  title: string

  @Column({ default: "" })
  url: string

  @Column({ default: "" })
  thumbnail: string

  @Column({ default: "00:00h" })
  estimatedTime: string

  @Column({ default: "" })
  dueDate: string

  @Column({ nullable: true })
  rating: number

  @Column({ default: "" })
  completedAt: string

  @Column({ nullable: true })
  position: number

  @Column({ default: "" })
  publicReview: string

  @Column({ default: "" })
  privateNote: string

  @CreateDateColumn()
  createdAt: string

  @UpdateDateColumn()
  updatedAt: string

  @ManyToOne((type) => Tag, (tag) => tag.resources, { onDelete: "CASCADE" })
  tag: Tag

  @Column({ nullable: true })
  tagId: number
}
