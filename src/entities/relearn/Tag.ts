import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { FollowingTag } from '../feed/FollowingTag';
import { Skill } from '../skillbase/Skill';
import { User } from '../User';
import { Resource } from './Resource';


@Entity()
export class Tag {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => User, user => user.tags, { onDelete: "CASCADE" })
    user: User;

    @Column()
    userId: number

    @OneToMany(type => Resource, resource => resource.tag)
    resources: Resource[]

    @OneToMany(type => Skill, skill => skill.tag)
    skills: Skill[]

    @OneToMany(type => FollowingTag, tagFollower => tagFollower.tag)
    tagFollowers: FollowingTag[]

    // --- end of relations

    @Column()
    name: string;

    @Column({ nullable: true })
    position: number;

    @Column({ default: "#ffffff" })
    color: string;

    @Column({ default: false })
    isPrivate: boolean

    @CreateDateColumn()
    createdAt: string

    @UpdateDateColumn()
    updatedAt: string



}
