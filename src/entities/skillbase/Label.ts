import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  type Relation,
} from "typeorm";
import { User } from "../User";

@Entity()
export class Label {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => User, (user) => user.labels, { onDelete: "CASCADE" })
  user: Relation<User>;

  @Column()
  userId: number;

  @Column({ default: "" })
  name: string;

  @Column({ default: "#db4035" })
  bgColor: string;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
