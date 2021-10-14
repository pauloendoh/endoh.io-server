import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "../entities/User";

export abstract class CreatedEntity {
  @PrimaryGeneratedColumn()
  id: number;

  abstract user: User; // forces implementation

  @Column()
  userId: number;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  // static checkOwnershipAsync(userId: number, entityId: number) {
  //   return this.findOne({ where: { userId, id: entityId } });
  // }
}
