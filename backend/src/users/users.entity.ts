import { Entity, PrimaryGeneratedColumn, CreateDateColumn, Column, ObjectIdColumn, ObjectId } from "typeorm";

@Entity()
export class Users {
    // @PrimaryGeneratedColumn('uuid')
    // id: string;

    @ObjectIdColumn()
    _id: ObjectId;

    @Column({ 'default': '' })
    chatId: string

    @Column('boolean', { default: true })
    active: boolean = true;

    @CreateDateColumn()
    joinedAt: Date;

    @CreateDateColumn({ 'nullable': true })
    leftAt: Date;
}