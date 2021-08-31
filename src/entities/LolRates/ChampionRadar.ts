import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { User } from "../User";
import { Champion } from "./Champion";

@Entity()
export class ChampionRadar {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => User, (user) => user.championRadars, {
    onDelete: "CASCADE",
  })
  user: User;

  @Column()
  userId: number;

  @ManyToOne((type) => Champion, (champion) => champion.playerChampions, {
    onDelete: "CASCADE",
  })
  champion: Champion;

  @Column()
  championId: number;

  @Column()
  dps: number;

  @Column()
  burst: number;

  @Column()
  tankiness: number;

  @Column()
  engage: number;

  @Column()
  protect: number;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
