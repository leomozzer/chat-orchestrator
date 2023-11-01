import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Room, SocketUsers } from './rooms.entity';
import { In, Repository } from 'typeorm';
import { MessageService } from 'src/message/message.service';
import { v4 as uuidv4 } from 'uuid';
import { ObjectId } from 'mongodb';

@Injectable()
export class RoomsService {
    constructor(
        @InjectRepository(Room) private roomRepository: Repository<Room>,
        @InjectRepository(SocketUsers) private socketRepository: Repository<SocketUsers>
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
            rooms.messages = rooms.messages.concat({
                '_id': new ObjectId(),
                'sentAt': new Date(),
                'user': user,
                'text': text
            })

            await this.roomRepository.update({ '_id': chatId }, { 'messages': rooms.messages })
        } catch (error) {
            throw error;
        }
    }

    async findOne(chatId) {
        try {
            const room = await this.roomRepository.findOne({
                where: {
                    '_id': chatId
                }
            })
            return room
        } catch (error) {
            throw error;
        }
    }

    async join(user: string, chatId: ObjectId, client: string) {
        try {
            const rooms = await this.roomRepository.findOne({
                where: {
                    '_id': chatId
                }
            })
            rooms.users = [{
                '_id': new ObjectId(),
                'user_id': user,
                'client': client,
                'chat_id': String(chatId)
            }]
            await this.roomRepository.update({ '_id': chatId }, { 'users': rooms.users })
            await this.socketRepository.save({
                'user_id': user,
                'client': client,
                'chat_id': String(chatId)
            })
        } catch (error) {
            throw error
        }
    }

    async left(client: string) {
        try {
            const user = await this.socketRepository.findOne({
                'where': {
                    'client': client
                }
            })
            const rooms = await this.roomRepository.findOne({
                where: {
                    '_id': new ObjectId(user.chat_id)
                }
            })
            console.log(rooms)
            // let updateRoom: Room
            // rooms.forEach(room => {
            //     if (room.users.length > 0) {
            //         room.users.forEach(user => {
            //             if (user.client == client) {
            //                 updateRoom = room
            //             }
            //         })
            //     }
            // })
            // console.log('updateRoom', updateRoom);
            //rooms.users = rooms.users.filter(user => user.client !== client)
            //await this.roomRepository.update({ '_id': rooms._id }, { 'users': rooms.users })
        } catch (error) {
            throw error
        }
    }
}
