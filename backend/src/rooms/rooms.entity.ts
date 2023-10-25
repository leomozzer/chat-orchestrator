import { Entity, CreateDateColumn, Column, ObjectIdColumn, ObjectId } from "typeorm";
import { Message } from '../message/message.entity'

@Entity()
export class SocketUsers {
    @ObjectIdColumn()
    _id: ObjectId;

    @Column()
    user_id: string;

    @Column()
    client: string;

    @Column()
    chat_id: string;
}
@Entity()
export class Room {

    @ObjectIdColumn()
    _id: ObjectId;

    @CreateDateColumn()
    createdAt: Date;

    @Column({ 'default': [] })
    messages: Message[]

    @Column({ 'default': [] })
    users: SocketUsers[]
}