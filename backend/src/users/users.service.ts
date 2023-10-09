import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './users.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(Users) private usersRepository: Repository<Users>
    ) { }
    getHello(): string {
        return 'Hello'
    }

    async getUsers() {
        try {
            const users = await this.usersRepository.find()
            return users
        } catch (error) {
            console.log(error)
            return error
        }
    }

    async NewUser() {
        await this.usersRepository.save({
            '_id': uuidv4()
        })
    }
}
