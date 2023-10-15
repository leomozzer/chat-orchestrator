import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from './rooms.entity';
import { Repository } from 'typeorm';
import { MessageService } from 'src/message/message.service';
import { v4 as uuidv4 } from 'uuid';
import { ObjectId } from 'mongodb';

@Injectable()
export class RoomsService {
    constructor(
        @InjectRepository(Room) private roomRepository: Repository<Room>
    ) { }

    async create() {
        try {
            const id = uuidv4()
            await this.roomRepository.save({
                '_id': id,
                'createdAt': new Date().toISOString()
            })
            return id
        } catch (error) {
            throw error
        }
    }

    async list() {
        try {
            const rooms = await this.roomRepository.find()
            return rooms
        } catch (error) {
            throw error
        }
    }

    async newMessage(user: string, text: string, chatId: ObjectId) {
        try {
            const rooms = await this.roomRepository.findOne({
                where: {
                    '_id': chatId
                }
            })
            if (!rooms) {
                throw "Chat not found"
            }
            rooms.messages = [{
                '_id': new ObjectId(),
                'sentAt': new Date(),
                'user': user,
                'text': text
            }]

            await this.roomRepository.update({ '_id': chatId }, { 'messages': rooms.messages })
        } catch (error) {
            throw error;
        }
    }
}
