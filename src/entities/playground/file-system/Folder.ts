import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
} from "typeorm";
import { CreatedEntity } from "../../../types/CreatedEntity";
import { User } from "../../User";
import { File } from "./File";

@Entity()
@Tree("closure-table")
export class Folder extends CreatedEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => User, (user) => user.folders, { onDelete: "CASCADE" })
  user: User;

  @Column()
  name: string;

  @TreeChildren()
  subfolders: Folder[];

  @TreeParent({ onDelete: "CASCADE" })
  parentFolder: Folder;

  @Column({ nullable: true })
  parentFolderId: Number;

  @OneToMany((type) => File, (file) => file.parentFolder)
  files: File[];
}
