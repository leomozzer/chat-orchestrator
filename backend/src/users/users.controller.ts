import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Public()
    @Get()
    getHello() {
        return this.usersService.getUsers()
    }

    @Get('/new')
    CreateUser() {
        return this.usersService.NewUser()
    }

}
