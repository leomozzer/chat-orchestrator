import { Controller, Get } from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';
import { RoomsService } from './rooms.service';

@Controller('rooms')
export class RoomsController {
    constructor(private readonly roomService: RoomsService) { }
    @Public()
    @Get()
    list() {
        return this.roomService.list()
    }
}
