import { Column, Entity, ManyToOne, type Relation } from "typeorm";
import { CreatedEntity } from "../../types/CreatedEntity";
import { User } from "../User";

@Entity()
export class Friend extends CreatedEntity {
  @ManyToOne((type) => User, (user) => user.friends, {
    onDelete: "CASCADE",
  })
  user: Relation<User>;

  @Column({ default: "" })
  name: string;
}
