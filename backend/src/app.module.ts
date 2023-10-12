import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { User } from './users/users.entity';
import { AuthModule } from './auth/auth.module';
import { RoomsModule } from './rooms/rooms.module';
import { RoomsGateway } from './rooms/rooms.gateway';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      'type': 'mongodb',
      'host': 'mongodb',
      'port': 27017,
      'database': process.env.MONGO_INITDB_DATABASE,
      'entities': [User],
      'useUnifiedTopology': true,
      'synchronize': true,
      'logging': true,
      'useNewUrlParser': true,
      username: process.env.MONGO_INITDB_ROOT_USERNAME,
      password: process.env.MONGO_INITDB_ROOT_PASSWORD,
      authSource: 'admin',
    }),
    UsersModule,
    RoomsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
