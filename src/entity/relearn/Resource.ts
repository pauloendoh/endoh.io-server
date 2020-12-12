import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from '../User';
import { Tag } from './Tag';


@Entity()
export class Resource {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => User, user => user.expenses, { onDelete: "CASCADE" })
    user: User;

    @Column()
    userId: number

    @Column()
    title: string;

    @Column()
    url: string;

    @Column()
    thumbnail: string;

    @Column()
    estimatedTime: string;

    @Column()
    dueDate: string;

    @Column({nullable: true, default: 0})
    rating: number

    @Column({default: ""})
    completedAt: string

    @Column({nullable: true})
    positionAtTag: number

    @CreateDateColumn()
    createdAt: string

    @UpdateDateColumn()
    updatedAt: string

    @ManyToOne(type => Tag, tag => tag.resources)
    tag: Tag

    @Column({nullable: true})
    tagId: number

}
