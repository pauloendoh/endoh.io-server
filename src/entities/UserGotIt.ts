import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  type Relation,
} from "typeorm"
import { User } from "./User"

@Entity()
export class UserGotIt {
  @PrimaryGeneratedColumn()
  id: number

  @OneToOne((type) => User, (user) => user.gotIt, { onDelete: "CASCADE" })
  @JoinColumn()
  user: Relation<User>

  @Column()
  userId: number

  @Column({ default: false })
  createTag: boolean

  @CreateDateColumn()
  createdAt: string

  @UpdateDateColumn()
  updatedAt: string
}
