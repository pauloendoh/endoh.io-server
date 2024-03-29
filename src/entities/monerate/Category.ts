import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "../User";
import { Expense } from "./Expense";

@Entity()
export default class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => User, (user) => user.categories, { onDelete: "CASCADE" })
  user: User;

  @Column()
  userId: number;

  @Column()
  name: string;

  @Column()
  icon: string;

  @Column()
  bgColor: string;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  // Relations
  @OneToMany((type) => Expense, (expense) => expense.category, {
    onDelete: "CASCADE",
  })
  expenses: Expense[];
}
