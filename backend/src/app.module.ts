import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { Users } from './users/users.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      'type': 'mongodb',
      'host': 'mongodb',
      'port': 27017,
      'database': 'mydb',
      'entities': [Users],
      'useUnifiedTopology': true,
      'synchronize': true,
      'logging': true,
      'useNewUrlParser': true,
      username: 'root',
      password: 'example',
      authSource: 'admin',
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
