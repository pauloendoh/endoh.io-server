import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Folder } from "../playground/file-system/Folder";
import { User } from "../User";
import { Note } from "./Note";

@Entity()
export class Doc {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => User, (user) => user.docs, {
    onDelete: "CASCADE",
  })
  user: User;
  @Column()
  userId: number;

  @ManyToOne(() => Folder, (folder) => folder.docs, { nullable: true })
  folder: Folder | null;

  @Column({ nullable: true })
  folderId: number | null;

  @OneToMany(() => Note, (note) => note.doc)
  notes: Note[];

  // END OF RELATIONS
  @Column()
  title: string;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  @Column({ type: "timestamp without time zone", nullable: true })
  lastOpenedAt: string;
}
