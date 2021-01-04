import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import Category from './monerate/Category';
import { Expense } from './monerate/Expense';
import Place from './monerate/Place';
import { OAuthToken } from './OAuthToken';


@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true, nullable: true })
    googleId: string;

    @Column({ unique: true })
    username: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ default: false })
    isAdmin: boolean

    @Column({ default: '' })
    picture: string

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    // Relations
    @OneToMany(type => Expense, expense => expense.user)
    expenses: Expense[]

    @OneToMany(type => Category, category => category.user)
    categories: Category[]

    @OneToMany(type => Place, place => place.user)
    places: Place[]

    @OneToMany(type => OAuthToken, oauthToken => oauthToken.user)
    oauthTokens: OAuthToken[]
}
