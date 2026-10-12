import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn, type Relation } from "typeorm";
import { User } from '../User';
import { Expense } from './Expense';

@Entity()
export default class Place {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => User, user => user.places, {onDelete: "CASCADE"})
    user: Relation<User>;

    @Column()
    userId: number

    @Column()
    name: string;

    @Column()
    icon: string;

    @Column()
    bgColor: string;

    @CreateDateColumn()
    createdAt: string

    @UpdateDateColumn()
    updatedAt: string

    // Relations
    @OneToMany(type => Expense, expense => expense.place, {onDelete: 'CASCADE'})
    expenses: Expense[]
}
