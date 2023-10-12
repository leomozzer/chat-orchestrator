import { Module } from '@nestjs/common';
import { RoomsGateway } from './rooms.gateway';
import { RoomsController } from './rooms.controller';

@Module({
    providers: [RoomsGateway],
    controllers: [RoomsController]
})
export class RoomsModule { }
