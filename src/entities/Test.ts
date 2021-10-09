import { Column, Entity, ManyToOne } from "typeorm";
import { CreatedBaseEntity } from "../types/CreatedBaseEntity";
import { User } from "./User";

@Entity()
export class Test extends CreatedBaseEntity {
  @Column({ default: "" })
  name: string;

  @ManyToOne((type) => User, (user) => user.tests)
  user: User;

  @Column({ default: "" })
  color: string;
}
