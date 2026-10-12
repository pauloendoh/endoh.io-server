import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
  type Relation,
} from "typeorm";
import { CreatedEntity } from "../../../types/CreatedEntity";
import { Doc } from "../../define/Doc";
import { User } from "../../User";
import { File } from "./File";

@Entity()
@Tree("closure-table")
export class Folder extends CreatedEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => User, (user) => user.folders, { onDelete: "CASCADE" })
  user: Relation<User>;

  @Column()
  name: string;

  @TreeChildren()
  subfolders: Folder[];

  @TreeParent({ onDelete: "CASCADE" })
  parentFolder: Relation<Folder>;

  @Column({ nullable: true })
  parentFolderId: number;

  @OneToMany((type) => File, (file) => file.parentFolder)
  files: File[];

  @OneToMany((type) => Doc, (doc) => doc.folder)
  docs: Doc[];
}
