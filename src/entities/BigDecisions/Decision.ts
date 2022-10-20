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
import { DecisionTable } from "./DecisionTable"

@Entity()
export class Decision {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne((type) => User, (user) => user.decisions, {
    onDelete: "CASCADE",
  })
  user: User
  @Column()
  userId: number

  @OneToMany(() => DecisionTable, (table) => table.decision)
  tables: DecisionTable[]

  // END OF RELATIONS
  @Column()
  title: string

  @Column({ default: true })
  isPriority: boolean

  @CreateDateColumn()
  createdAt: string

  @UpdateDateColumn()
  updatedAt: string
}
