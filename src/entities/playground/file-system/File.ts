import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { CreatedEntity } from "../../../types/CreatedEntity";
import { User } from "../../User";
import { Folder } from "./Folder";

@Entity()
export class File extends CreatedEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => User, (user) => user.files, { onDelete: "CASCADE" })
  user: User;

  @Column()
  name: string;

  @ManyToOne((type) => Folder, (folder) => folder.files, {
    onDelete: "CASCADE",
  })
  parentFolder: Folder;

  @Column()
  parentFolderId: number;
}
