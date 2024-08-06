import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm"
import { Tag } from "../relearn/Tag"
import { User } from "../User"
import { Label } from "./Label"
import { SkillExpectation } from "./SkillExpectation"
import { SkillProgress } from "./SkillProgress"

@Entity()
export class Skill {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne((type) => User, (user) => user.skills, { onDelete: "CASCADE" })
  user: User
  @Column()
  userId: number

  @OneToMany((type) => SkillProgress, (progress) => progress.skill)
  progresses: SkillProgress[]

  @ManyToMany((type) => Skill, (skill) => skill.childDependencies)
  @JoinTable({
    name: "skill_dependency",
    joinColumn: {
      name: "skillId",
      referencedColumnName: "id" as keyof Skill,
    },
    inverseJoinColumn: {
      name: "dependencyId",
      referencedColumnName: "id" as keyof Skill,
    },
  })
  dependencies: Skill[]

  @ManyToMany((type) => Skill, (skill) => skill.dependencies)
  childDependencies: Skill[]

  @ManyToMany((type) => Label)
  @JoinTable()
  labels: Label[]

  @ManyToOne((type) => Tag, (tag) => tag.skills, { onDelete: "SET NULL" })
  tag: Tag
  @Column({ nullable: true })
  tagId: number

  @OneToMany((type) => SkillExpectation, (expectation) => expectation.skill)
  expectations: SkillExpectation[]

  // END OF RELATIONS

  @Column({ default: false })
  isPriority: boolean

  @Column({ default: "" })
  name: string

  @Column({ nullable: true })
  currentLevel: number

  @Column({ nullable: true })
  goalLevel: number

  @Column({ nullable: true, type: "float" })
  priority: number | null

  @Column({ nullable: true, type: "float" })
  discomfortZone: number | null

  @Column({ default: false })
  isPublic: boolean

  @CreateDateColumn()
  createdAt: string

  @UpdateDateColumn()
  updatedAt: string
}
