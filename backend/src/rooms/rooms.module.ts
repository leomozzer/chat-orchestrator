import { Module } from '@nestjs/common';
import { RoomsGateway } from './rooms.gateway';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room, SocketUsers } from './rooms.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [TypeOrmModule.forFeature([Room, SocketUsers]), AuthModule],
    providers: [RoomsGateway, RoomsService],
    controllers: [RoomsController]
})
export class RoomsModule { }
