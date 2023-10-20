import { Controller, Get, UseGuards, Request, Post, Body } from '@nestjs/common';
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

    // TODO: Need to update this function to a better one
    @Public()
    @Post('/new')
    create(@Body() body: any) {
        const { username, password } = body
        return this.usersService.create(username, password)
    }

}
