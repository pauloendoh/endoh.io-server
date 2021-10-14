import { Column, Entity, ManyToOne } from "typeorm";
import { CreatedEntity } from "../types/CreatedEntity";
import { User } from "./User";

@Entity()
export class Test extends CreatedEntity {
  @Column({ default: "" })
  name: string;

  @ManyToOne((type) => User, (user) => user.tests)
  user: User;

  @Column({ default: "" })
  color: string;
}
