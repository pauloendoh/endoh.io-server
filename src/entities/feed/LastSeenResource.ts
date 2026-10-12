import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from "typeorm"
import { User } from "../User"

@Entity()
export class LastSeenResource {
  @PrimaryGeneratedColumn()
  id: number

  @OneToOne((_) => User, { onDelete: "CASCADE" })
  @JoinColumn()
  user: Relation<User>

  @Column()
  userId: number

  @Column()
  lastSeenAt: string
}
