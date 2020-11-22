import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from '../User';

@Entity()
export class Expense {

    @PrimaryGeneratedColumn()
    id: number;

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

    @Column("double precision", {nullable: true})
    value: number;

    @CreateDateColumn()
    createdAt: string

    @UpdateDateColumn()
    updatedAt: string
}
