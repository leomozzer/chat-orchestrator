import { Entity, CreateDateColumn, Column, ObjectIdColumn, ObjectId } from "typeorm";

@Entity()
export class Message {

    @ObjectIdColumn()
    _id: ObjectId;

    @Column()
    user: string

    @CreateDateColumn()
    sentAt: Date;

    @Column()
    text: string
}