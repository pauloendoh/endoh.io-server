import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm"
import { User } from "../User"

@Entity()
export class LastSeenResource {
  @PrimaryGeneratedColumn()
  id: number

  @OneToOne((_) => User, { onDelete: "CASCADE" })
  @JoinColumn()
  user: User

  @Column()
  userId: number

  @Column()
  lastSeenAt: string
}
