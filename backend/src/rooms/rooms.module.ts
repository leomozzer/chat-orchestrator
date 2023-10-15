import { Module } from '@nestjs/common';
import { RoomsGateway } from './rooms.gateway';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './rooms.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Room])],
    providers: [RoomsGateway, RoomsService],
    controllers: [RoomsController]
})
export class RoomsModule { }
