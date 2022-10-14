import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm"
import { User } from "../User"
import { Doc } from "./Doc"

@Entity()
export class Note {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne((type) => User, (user) => user.docs, {
    onDelete: "CASCADE",
  })
  user: User
  @Column()
  userId: number

  @ManyToOne(() => Doc, (doc) => doc.notes, {
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

  @Column({ default: 1 })
  weight: number

  @Column({ default: false })
  toRefine: boolean

  @CreateDateColumn()
  createdAt: string

  @UpdateDateColumn()
  updatedAt: string
}
