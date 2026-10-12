import { Column, Entity, ManyToOne, type Relation } from "typeorm"
import { CreatedEntity } from "../types/CreatedEntity"
import { User } from "./User"

@Entity()
export class Test extends CreatedEntity {
  @Column({ default: "" })
  name: string

  @ManyToOne((type) => User, (user) => user.tests)
  user: Relation<User>

  @Column({ default: "" })
  color: string

  @Column({ default: false })
  isTrue: boolean
}
