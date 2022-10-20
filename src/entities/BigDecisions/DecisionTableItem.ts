import {
  Column,
  CreateDateColumn,
  Entity, ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm"
import { User } from "../User"
import { DecisionTable } from "./DecisionTable"

@Entity()
export class DecisionTableItem {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne((type) => User, (user) => user.decisionTables, {
    onDelete: "CASCADE",
  })
  user: User
  @Column()
  userId: number

  @ManyToOne((type) => DecisionTable, (table) => table.items, {
    onDelete: "CASCADE",
  })
  decisionTable: DecisionTable
  @Column()
  decisionTableId: number

  // END OF RELATIONS
  @Column({ nullable: true })
  index: number

  @Column()
  problem: string

  @Column()
  solution: string

  @Column({ default: 1 })
  weight: number

  @CreateDateColumn()
  createdAt: string

  @UpdateDateColumn()
  updatedAt: string
}
