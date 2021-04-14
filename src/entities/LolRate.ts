import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from './User';


@Entity()
export class LolRate {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    championName: string

    @Column()
    iconUrl: string

    @Column()
    role: string

    @Column({ nullable: true, type: "decimal", precision: 5, scale: 2 })
    opggPick: number

    @Column({ nullable: true, type: "decimal", precision: 5, scale: 2 })
    opggWin: number

    @Column({ nullable: true, type: "decimal", precision: 5, scale: 2 })
    opggAvg: number

    @Column({ nullable: true })
    opggUpdatedAt: string

    @Column({ nullable: true, type: "decimal", precision: 5, scale: 2 })
    lolgraphsPick: number

    @Column({ nullable: true, type: "decimal", precision: 5, scale: 2 })
    lolgraphsWin: number

    @Column({ nullable: true, type: "decimal", precision: 5, scale: 2 })
    lolgraphsAvg: number

    @Column({ nullable: true })
    lolgraphsUpdatedAt: string

    @Column({ nullable: true, type: "decimal", precision: 5, scale: 2 })
    lolalyticsPick: number

    @Column({ nullable: true, type: "decimal", precision: 5, scale: 2 })
    lolalyticsWin: number

    @Column({ nullable: true, type: "decimal", precision: 5, scale: 2 })
    lolalyticsAvg: number

    @Column({ nullable: true })
    lolalyticsUpdatedAt: string

    @Column({ nullable: true, type: "decimal", precision: 5, scale: 2 })
    blitzPick: number

    @Column({ nullable: true, type: "decimal", precision: 5, scale: 2 })
    blitzWin: number

    @Column({ nullable: true, type: "decimal", precision: 5, scale: 2 })
    blitzAvg: number

    @Column({ nullable: true })
    blitzUpdatedAt: string

    @CreateDateColumn()
    createdAt: string

    @UpdateDateColumn()
    updatedAt: string

}

