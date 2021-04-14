import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../User';


@Entity()
export class UserSuggestion {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => User, user => user.userSuggestions, { onDelete: "CASCADE" })
    @JoinColumn()
    user: User

    @Column()
    userId: number

    @ManyToOne(type => User, user => user.suggestedBy, { onDelete: "CASCADE" })
    @JoinColumn()
    suggestedUser: User

    @Column()
    suggestedUserId: number

    @Column({ default: '' })
    description: string

    @Column({ default: '' })
    dontShowUntil: string

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

}
