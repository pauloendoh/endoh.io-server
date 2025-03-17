import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm"
import { z } from "zod"
import { User } from "../User"
import { Doc } from "./Doc"

@Entity({
  name: "question",
})
export class Question {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne((type) => User, (user) => user.docs, {
    onDelete: "CASCADE",
  })
  user: User
  @Column()
  userId: number

  @ManyToOne(() => Doc, (doc) => doc.questions, {
    onDelete: "CASCADE",
  })
  doc: Doc
  @Column()
  docId: number

  // END OF RELATIONS
  @Column()
  index: number

  // required
  @Column()
  description: string

  @Column({ default: "" })
  question: string

  @Column("decimal", {
    default: 1,
    precision: 5,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  weight: number

  @Column({ default: 0 })
  testedTimes: number

  @Column({ default: false })
  toRefine: boolean

  @CreateDateColumn()
  createdAt: string

  @UpdateDateColumn()
  updatedAt: string
}

export const questionSchema = z.object({
  id: z.number(),
  userId: z.number(),
  docId: z.number(),
  index: z.number(),
  description: z.string(),
  question: z.string(),
  weight: z.number(),
  testedTimes: z.number(),
  toRefine: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
})
