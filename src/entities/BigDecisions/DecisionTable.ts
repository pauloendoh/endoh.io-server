import {
  AfterInsert,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  getRepository,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm"
import { User } from "../User"
import { Decision } from "./Decision"
import { DecisionTableItem } from "./DecisionTableItem"

@Entity()
export class DecisionTable {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne((type) => User, (user) => user.decisionTables, {
    onDelete: "CASCADE",
  })
  user: User
  @Column()
  userId: number

  @ManyToOne((type) => Decision, (decision) => decision.tables, {
    onDelete: "CASCADE",
  })
  decision: Decision
  @Column()
  decisionId: number

  @OneToMany(() => DecisionTableItem, (item) => item.decisionTable)
  items: DecisionTableItem[]

  // END OF RELATIONS
  @Column()
  title: string

  @Column({ nullable: true })
  index: number

  @CreateDateColumn()
  createdAt: string

  @UpdateDateColumn()
  updatedAt: string

 
}
