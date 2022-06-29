import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class ResponseTime {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  method: string;

  @Column({ nullable: true })
  endpoint: string;

  @Column({ default: 0 })
  millis: number;

  @Column({ default: 0, type: "decimal" })
  contentLengthBytes: number;

  @Column({ nullable: true })
  statusCode: number;

  @CreateDateColumn()
  createdAt: string;
}
