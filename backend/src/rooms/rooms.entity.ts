import { Entity, CreateDateColumn, Column, ObjectIdColumn, ObjectId } from "typeorm";
import { Message } from '../message/message.entity'

@Entity()
export class Room {

    @ObjectIdColumn()
    _id: ObjectId;

    @CreateDateColumn()
    createdAt: Date;

    @Column({ 'default': [] })
    messages: Message[]
}