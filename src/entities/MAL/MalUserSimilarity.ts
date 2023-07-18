import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm"

@Entity()
export class MalUserSimilarity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  usernameA: string

  @Column()
  usernameB: string

  @Column({
    type: "float",
    default: 0,
  })
  animePercentage: number

  @Column({
    type: "int",
    default: 0,
  })
  animeCount: number

  @Column({
    type: "float",
    default: 0,
  })
  mangaPercentage: number

  @Column({
    type: "int",
    default: 0,
  })
  mangaCount: number

  @Column({
    default: "",
  })
  gender: string

  @Column({
    default: "",
  })
  location: string

  @Column({
    default: "",
  })
  birthday: string

  @Column({
    type: "varchar",
    nullable: true,
  })
  lastScraped: string | null

  @Column({
    type: "varchar",
    nullable: true,
  })
  friendsScrapedAt: string | null

  @Column({ default: "" })
  imageUrl: string

  @Column({ default: false })
  checked: boolean

  @Column({ default: "" })
  lastOnlineAt: string

  @Column({ default: "" })
  lastErrorAt: string

  @CreateDateColumn()
  createdAt: string

  @UpdateDateColumn()
  updatedAt: string
}
