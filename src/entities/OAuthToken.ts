import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn, type Relation } from 'typeorm';
import { User } from './User';


@Entity()
export class UserToken {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => User, user => user.tokens, { onDelete: "CASCADE" })
    user: Relation<User>;

    @Column()
    userId: number

    @Column()
    type: string

    @Column()
    token: string;

    @Column()
    expiresAt: string;

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

}

