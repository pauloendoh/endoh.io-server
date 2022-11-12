import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm"
import { User } from "./User"

@Entity()
export class UserGotIt {
  @PrimaryGeneratedColumn()
  id: number

  @OneToOne((type) => User, (user) => user.gotIt, { onDelete: "CASCADE" })
  @JoinColumn()
  user: User

  @Column()
  userId: number

  @Column({ default: false })
  createTag: boolean

  @CreateDateColumn()
  createdAt: string

  @UpdateDateColumn()
  updatedAt: string
}
