import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm"

@Entity()
export class LolRate {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  championName: string

  @Column()
  iconUrl: string

  @Column()
  role: string

  @Column("double precision", { nullable: true })
  opggPick: number

  @Column("double precision", { nullable: true })
  opggWin: number

  @Column("double precision", { nullable: true })
  opggAvg: number

  @Column({ nullable: true })
  opggUpdatedAt: string

  @Column("double precision", { nullable: true })
  lolgraphsPick: number

  @Column("double precision", { nullable: true })
  lolgraphsWin: number

  @Column("double precision", { nullable: true })
  lolgraphsAvg: number

  @Column({ nullable: true })
  lolgraphsUpdatedAt: string

  @Column("double precision", { nullable: true })
  lolalyticsPick: number

  @Column("double precision", { nullable: true })
  lolalyticsWin: number

  @Column("double precision", { nullable: true })
  lolalyticsAvg: number

  @Column({ nullable: true })
  lolalyticsUpdatedAt: string

  @Column("double precision", { nullable: true })
  blitzPick: number

  @Column("double precision", { nullable: true })
  blitzWin: number

  @Column("double precision", { nullable: true })
  blitzAvg: number

  @Column({ nullable: true })
  blitzUpdatedAt: string

  @Column("double precision", { nullable: true })
  uggPick: number

  @Column("double precision", { nullable: true })
  uggWin: number

  @Column("double precision", { nullable: true })
  uggAvg: number

  @Column({ nullable: true })
  uggUpdatedAt: string

  @CreateDateColumn()
  createdAt: string

  @UpdateDateColumn()
  updatedAt: string
}
