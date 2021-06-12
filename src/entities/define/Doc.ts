import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm"
import { User } from "../User"
import { Note } from "./Note"

@Entity()
export class Doc {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne((type) => User, (user) => user.docs, {
    onDelete: "CASCADE",
  })
  user: User
  @Column()
  userId: number

  @OneToMany(() => Note, (note) => note.doc)
  notes: Note[]

  // END OF RELATIONS
  @Column()
  title: string

  @CreateDateColumn()
  createdAt: string

  @UpdateDateColumn()
  updatedAt: string
}
