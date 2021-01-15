import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Tag } from '../relearn/Tag';
import { User } from '../User';


@Entity()
export class Skill {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => User, user => user.skills, { onDelete: "CASCADE" })
    user: User;
    @Column()
    userId: number

    @ManyToMany(type => Skill, skill => skill.childDependencies)
    @JoinTable({
        name: "skill_dependency",
        joinColumn: {
            name: "skillId",
            referencedColumnName: "id" as keyof Skill
        },
        inverseJoinColumn: {
            name: "dependencyId",
            referencedColumnName: "id" as keyof Skill
        },
    })
    dependencies: Skill[]

    @ManyToMany(type => Skill, skill => skill.dependencies)
    childDependencies: Skill[]

    @ManyToOne(type => Tag, tag => tag.skills, { onDelete: "CASCADE" })
    tag: Tag
    @Column({nullable: true})
    tagId: number

    // END OF RELATIONS

    @Column({ default: false })
    isPriority: boolean;

    @Column({ default: '' })
    name: string;

    @Column({ nullable: true })
    currentLevel: number;

    @Column({ nullable: true })
    goalLevel: number;

    @CreateDateColumn()
    createdAt: string

    @UpdateDateColumn()
    updatedAt: string


}
