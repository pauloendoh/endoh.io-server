import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from '../User';
import Category from './Category';
import Place from './Place';

@Entity()
export class Expense {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => User, user => user.expenses, { onDelete: "CASCADE" })
    user: User;

    @Column()
    userId: number



    @Column()
    description: string;

    @Column()
    name: string;

    @Column()
    rating: number;

    @Column("double precision", { nullable: true })
    value: number;

    @CreateDateColumn()
    createdAt: string

    @UpdateDateColumn()
    updatedAt: string


    @ManyToOne(type => Place, place => place.expenses, { nullable: true })
    place: Place

    @Column({ nullable: true })
    placeId: number;


    @ManyToOne(type => Category, category => category.expenses, { nullable: true })
    category: Category

    @Column({ nullable: true })
    categoryId: number;

}
