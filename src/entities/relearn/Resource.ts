import { DateTimeResolver } from "graphql-scalars";
import { Field, ObjectType } from "type-graphql";
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "../User";
import { Tag } from "./Tag";

@Entity()
@ObjectType()
export class Resource {
  @PrimaryGeneratedColumn()
  @Field()
  id: number;

  @ManyToOne((type) => User, (user) => user.expenses, { onDelete: "CASCADE" })
  user: User;

  @Column()
  @Field()
  userId: number;

  @Column({ default: "" })
  @Field()
  title: string;

  @Column({ default: "" })
  @Field()
  url: string;

  @Column({ default: "" })
  @Field()
  thumbnail: string;

  @Column({ default: "00:00h" })
  @Field()
  estimatedTime: string;

  @Column({ default: "" })
  @Field()
  dueDate: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  rating: number;

  @Column({ default: "" })
  @Field()
  completedAt: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  position: number;

  @Column({ default: "" })
  @Field()
  publicReview: string;

  @Column({ default: "" })
  @Field()
  privateNote: string;

  @CreateDateColumn()
  @Field(() => DateTimeResolver)
  createdAt: string;

  @UpdateDateColumn()
  @Field(() => DateTimeResolver)
  updatedAt: string;

  @ManyToOne((type) => Tag, (tag) => tag.resources, { onDelete: "CASCADE" })
  tag: Tag;

  @Column({ nullable: true })
  @Field({ nullable: true })
  tagId: number;

  @Column("tsvector", { select: false, nullable: true })
  @Index("document_weights_idx")
  document_with_weights: any;
}
