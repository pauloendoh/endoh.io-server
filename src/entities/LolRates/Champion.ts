import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ChampionRadar } from "./ChampionRadar";
import { PlayerChampion } from "./PlayerChampion";

@Entity()
export class Champion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  iconUrl: string;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  // relations
  @OneToMany(
    (type) => PlayerChampion,
    (playerChampion) => playerChampion.champion
  )
  playerChampions: PlayerChampion[];

  @OneToMany(
    (type) => ChampionRadar,
    (cRadar) => cRadar.champion
  )
  championRadars: ChampionRadar[];
}
