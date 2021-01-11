import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import Category from './monerate/Category';
import { Expense } from './monerate/Expense';
import Place from './monerate/Place';
import { User } from './User';


@Entity()
export class UserToken {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => User, user => user.tokens, { onDelete: "CASCADE" })
    user: User;

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

