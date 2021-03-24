import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../User';


@Entity()
export class Notification {

    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(type => User, user => user.notifications, { onDelete: "CASCADE" })
    @JoinColumn()
    user: User

    @Column()
    userId: number

    @Column({ default: '' })
    type: string // follow, 

    @Column({ default: '' })
    message: string

    @Column({ default: false })
    seen: boolean

    @OneToMany(type => User, user => user.followingNotifications, { onDelete: "CASCADE" })
    @JoinColumn()
    follower: User

    @Column()
    followerId: number

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

}
