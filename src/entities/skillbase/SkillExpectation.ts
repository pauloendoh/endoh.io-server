import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm"
import { User } from "../User"
import { Skill } from "./Skill"

@Entity()
export class SkillExpectation {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne((type) => User, (user) => user.skillExpectations, {
    onDelete: "CASCADE",
  })
  user: User
  @Column()
  userId: number

  @ManyToOne((type) => Skill, (skill) => skill.expectations, {
    onDelete: "CASCADE",
  })
  skill: Skill
  @Column({ nullable: true })
  skillId: number

  // END OF RELATIONS

  @Column()
  level: number

  @Column()
  index: number

  @Column()
  description: string

  @Column()
  checked: boolean

  @CreateDateColumn()
  createdAt: string

  @UpdateDateColumn()
  updatedAt: string
}
