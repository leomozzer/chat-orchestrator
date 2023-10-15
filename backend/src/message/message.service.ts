import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './message.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MessageService {
    constructor(
        @InjectRepository(Message) private messageRepository: Repository<Message>
    ) { }

    async create(user: string, text: string) {
        try {
            await this.messageRepository.save({
                '_id': uuidv4(),
                'user': user,
                'sentAt': new Date().toISOString(),
                'text': text
            })
        } catch (error) {
            throw error
        }
    }
}
