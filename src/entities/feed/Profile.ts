import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  type Relation,
} from "typeorm";
import { User } from "../User";

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne((type) => User, (user) => user.profile, { onDelete: "CASCADE" })
  @JoinColumn()
  user: Relation<User>;

  @Column()
  userId: number;

  @Column({ default: "" })
  fullName: string;

  @Column({ default: "" })
  bio: string;

  @Column({ default: "" })
  pictureUrl: string;

  @Column({ default: "" })
  pictureName: string;

  @Column({ default: "" })
  website: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
