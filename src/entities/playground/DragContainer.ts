import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { CreatedEntity } from "../../types/CreatedEntity";
import { User } from "../User";
import { DragItem } from "./DragItem";

@Entity()
export class DragContainer extends CreatedEntity {
  @ManyToOne((type) => User, (user) => user.dragContainers, {
    onDelete: "CASCADE",
  })
  user: User;

  @OneToMany((type) => DragItem, (dragItem) => dragItem.container)
  dragItems: DragItem[];

  @Column({ default: "" })
  name: string;

  @Column()
  position: number;
}
