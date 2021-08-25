import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { User } from "../User";
import { PlayerChampion } from "./PlayerChampion";

@Entity()
export class Player {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => User, (user) => user.players, { onDelete: "CASCADE" })
  user: User;

  @Column()
  userId: number;

  @Column()
  name: string;

  // relations
  @OneToMany(
    (type) => PlayerChampion,
    (playerChampion) => playerChampion.player
  )
  champions: PlayerChampion[];

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
