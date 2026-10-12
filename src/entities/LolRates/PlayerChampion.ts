import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  type Relation,
} from "typeorm"
import type { RoleTypes } from "../../types/domain/lolates/RoleTypes"
import type { SkillLevelTypes } from "../../types/domain/lolates/SkillLevelTypes"
import { User } from "../User"
import { Champion } from "./Champion"
import { Player } from "./Player"

@Entity()
export class PlayerChampion {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne((type) => User, (user) => user.players, { onDelete: "CASCADE" })
  user: Relation<User>

  @Column()
  userId: number

  @ManyToOne((type) => Player, (player) => player.champions, {
    onDelete: "CASCADE",
  })
  player: Relation<Player>

  @Column()
  playerId: number

  @ManyToOne((type) => Champion, (champion) => champion.playerChampions, {
    onDelete: "CASCADE",
  })
  champion: Relation<Champion>

  @Column()
  championId: number

  // explicit type: string-union aliases have no runtime metadata under bun
  @Column({ type: "varchar" })
  role: RoleTypes

  @Column({ type: "varchar" })
  skillLevel: SkillLevelTypes

  @Column({
    default: "",
  })
  notes: string

  @CreateDateColumn()
  createdAt: string

  @UpdateDateColumn()
  updatedAt: string
}
