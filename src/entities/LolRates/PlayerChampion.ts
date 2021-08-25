import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { RoleTypes } from "../../types/domain/lolates/RoleTypes";
import { SkillLevelTypes } from "../../types/domain/lolates/SkillLevelTypes";
import { User } from "../User";
import { Champion } from "./Champion";
import { Player } from "./Player";

@Entity()
export class PlayerChampion {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => User, (user) => user.players, { onDelete: "CASCADE" })
  user: User;

  @Column()
  userId: number;

  @ManyToOne((type) => Player, (player) => player.champions, {
    onDelete: "CASCADE",
  })
  player: Player;

  @Column()
  playerId: number;

  @ManyToOne((type) => Champion, (champion) => champion.playerChampions, {
    onDelete: "CASCADE",
  })
  champion: Champion;

  @Column()
  championId: number;

  @Column()
  role: RoleTypes;

  @Column()
  skillLevel: SkillLevelTypes;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
