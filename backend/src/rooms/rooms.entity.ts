import { Entity, PrimaryGeneratedColumn, CreateDateColumn, Column, ObjectIdColumn, ObjectId } from "typeorm";

export class Message {
    message: string;
    date: Date;
    user: string;
}
@Entity()
export class Room {

    @ObjectIdColumn()
    _id: ObjectId;

    @CreateDateColumn()
    createdAt: Date;

    @Column(() => Message)
    messages: Message[]
}