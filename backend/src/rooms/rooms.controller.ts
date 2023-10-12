import { Controller, Get } from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('rooms')
export class RoomsController {

    @Public()
    @Get()
    getRooms() {
        return 'ola'
    }
}
