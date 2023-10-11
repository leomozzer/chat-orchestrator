import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { ObjectId, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private usersRepository: Repository<User>
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
            '_id': uuidv4(),
            'username': 'leo',
            'password': '1234',
            'crecreatedAt': new Date().toISOString(),
            'lastLogin': new Date().toISOString()
        })
    }

    async findOne(username: string, password: string): Promise<User | undefined> {
        const user = await this.usersRepository.findOne({
            where: {
                username: username,
                password: password
            }
        })
        return user
    }

    async updateLastLogin(id: ObjectId): Promise<boolean> {
        const updateLastLogin = await this.usersRepository.update({ '_id': id }, { 'lastLogin': new Date().toISOString() })
        if (updateLastLogin.affected !== 1) {
            throw new Error('Could not update last login')
        }
        return true
    }
}
