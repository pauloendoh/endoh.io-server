import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Tag } from '../relearn/Tag';
import { User } from '../User';


@Entity()
export class FollowingTag {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => User, user => user.followingTags, { onDelete: "CASCADE" })
    @JoinColumn()
    follower: User

    @Column()
    followerId: number

    @ManyToOne(type => User, user => user.followingTags, { onDelete: "CASCADE" })
    @JoinColumn()
    followingUser: User

    @Column()
    followingUserId: number

    @ManyToOne(type => Tag, tag => tag.tagFollowers, { onDelete: "CASCADE" })
    @JoinColumn()
    tag: Tag

    @Column()
    tagId: number

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

}
