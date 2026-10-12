import { Column, Entity, ManyToOne, type Relation } from "typeorm";
import { CreatedEntity } from "../../types/CreatedEntity";
import { User } from "../User";
import { DragContainer } from "./DragContainer";

@Entity()
export class DragItem extends CreatedEntity {
  @ManyToOne((type) => User, (user) => user.dragItems, { onDelete: "CASCADE" })
  user: Relation<User>;

  @ManyToOne((type) => DragContainer, (container) => container.dragItems, {
    onDelete: "CASCADE",
  })
  container: Relation<DragContainer>;

  @Column()
  containerId: number;

  @Column({ default: "" })
  name: string;

  @Column()
  position: number;
}
