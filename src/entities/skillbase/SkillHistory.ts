import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "../User";

@Entity()
export class SkillHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => User, (user) => user.skills, { onDelete: "CASCADE" })
  user: User;
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
