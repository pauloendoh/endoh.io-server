import { Column, Entity, ManyToOne } from "typeorm";
import { CreatedEntity } from "../../types/CreatedEntity";
import { User } from "../User";

@Entity()
export class Friend extends CreatedEntity {
  @ManyToOne((type) => User, (user) => user.friends, {
    onDelete: "CASCADE",
  })
  user: User;

  @Column({ default: "" })
  name: string;
}
