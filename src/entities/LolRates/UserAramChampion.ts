import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm"
import { User } from "../User"
import { Champion } from "./Champion"

@Entity()
export class UserAramChampion {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne((type) => User, (user) => user.aramChampions, {
    onDelete: "CASCADE",
  })
  user: User

  @Column()
  userId: number

  @ManyToOne((type) => Champion, (champion) => champion.playerChampions, {
    onDelete: "CASCADE",
  })
  champion: Champion

  @Column()
  championId: number

  @Column()
  fun: number

  @Column()
  runes: string

  @Column()
  items: string

  @Column()
  extraNotes: string

  @CreateDateColumn()
  createdAt: string

  @UpdateDateColumn()
  updatedAt: string
}
