import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from "typeorm";
import { User } from "../User";

@Entity()
export class SkillHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => User, (user) => user.skills, { onDelete: "CASCADE" })
  user: Relation<User>;
  @Column()
  userId: number;

  @Column()
  skillId: number;

  @Column()
  skillName: string;

  @Column({ nullable: true })
  currentLevel: number;

  @CreateDateColumn()
  createdAt: string;
}
