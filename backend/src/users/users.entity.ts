import { Entity, PrimaryGeneratedColumn, CreateDateColumn, Column, ObjectIdColumn, ObjectId } from "typeorm";

@Entity()
export class User {

    @ObjectIdColumn()
    _id: ObjectId;

    @Column()
    username: string

    @Column()
    password: string

    @CreateDateColumn()
    createdAt: Date;

    @CreateDateColumn()
    lastLogin: Date;
}