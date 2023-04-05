import { Column, Entity, OneToOne } from "typeorm"
import { CreatedEntity } from "../../types/CreatedEntity"
import { User } from "../User"

@Entity()
export class MalUser extends CreatedEntity {
  @OneToOne((type) => User, (user) => user.malUser, {
    onDelete: "CASCADE",
  })
  user: User

  @Column({ default: "" })
  username: string

  @Column({ default: "" })
  password: string
}
