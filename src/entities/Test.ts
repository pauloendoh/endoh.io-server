import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from './User';


@Entity()
export class Test {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: '' })
    name: string

    @Column({ default: '' })
    color: string
}
