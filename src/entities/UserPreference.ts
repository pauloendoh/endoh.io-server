import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from './User';


@Entity()
export class UserPreference {

    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(type => User, user => user.preference, { onDelete: "CASCADE" })
    @JoinColumn()
    user: User

    @Column({ default: true })
    relearnAutofillURL: boolean

    @Column({ default: "/" })
    relearnLastAccessedRoute: string

    @Column({ default: false })
    skillbaseSidebarIsOpen: boolean

    @Column({ type: "simple-json", nullable: true })
    skillbaseSortSkill: {
        sortBy: string,
        order: "asc" | "desc"
    }

    @Column({ default: "" })
    skillbaseTextFilter: string

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date


    constructor() {
        this.id = null
        this.relearnAutofillURL = true
        this.relearnLastAccessedRoute = '/'
        this.skillbaseSidebarIsOpen = false
        this.skillbaseSortSkill = null
        this.skillbaseTextFilter = ""
        this.createdAt = new Date()
        this.updatedAt = new Date()

        return this
    }
}
