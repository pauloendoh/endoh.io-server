import { classToPlain, Exclude } from 'class-transformer';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from './User';

@Entity()
export class Expense {

    @PrimaryGeneratedColumn()
    id: number;

    @Exclude({toPlainOnly: true})
    @ManyToOne(type => User, user => user.expenses, {onDelete: "CASCADE"})
    user: User;

    @Column()
    userId: number

    @Column()
    place: string;

    @Column()
    description: string;

    @Column()
    name: string;

    @Column()
    rating: number;

    @Column()
    value: number;

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    toJSON(){
        return classToPlain(this)
    }
}
