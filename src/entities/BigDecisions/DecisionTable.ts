import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  type Relation,
} from "typeorm";
import { User } from "../User";
import { Decision } from "./Decision";
import { DecisionTableItem } from "./DecisionTableItem";

@Entity()
export class DecisionTable {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => User, (user) => user.decisionTables, {
    onDelete: "CASCADE",
  })
  user: Relation<User>;
  @Column()
  userId: number;

  @ManyToOne((type) => Decision, (decision) => decision.tables, {
    onDelete: "CASCADE",
  })
  decision: Relation<Decision>;
  @Column()
  decisionId: number;

  @OneToMany(() => DecisionTableItem, (item) => item.decisionTable)
  items: DecisionTableItem[];

  // END OF RELATIONS
  @Column()
  title: string;

  @Column({ nullable: true })
  index: number;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
