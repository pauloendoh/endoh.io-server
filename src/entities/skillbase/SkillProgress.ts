import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn, type Relation } from "typeorm";
import { User } from '../User';
import { Skill } from './Skill';


@Entity()
export class SkillProgress {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => User, user => user.skillProgresses, { onDelete: "CASCADE" })
    user: Relation<User>;
    @Column()
    userId: number

    @ManyToOne(type => Skill, skill => skill.progresses, { onDelete: "CASCADE" })
    skill: Relation<Skill>;
    @Column()
    skillId: number

    // END OF RELATIONS

    @Column({ nullable: true })
    oldLevel: number;

    @Column({ nullable: true })
    newLevel: number;

    @Column({nullable: true})
    goalLevel: number;

    @CreateDateColumn()
    createdAt: string

    @UpdateDateColumn()
    updatedAt: string
}
