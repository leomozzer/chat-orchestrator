import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { User } from './users/users.entity';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      'type': 'mongodb',
      'host': 'mongodb',
      'port': 27017,
      'database': 'mydb',
      'entities': [User],
      'useUnifiedTopology': true,
      'synchronize': true,
      'logging': true,
      'useNewUrlParser': true,
      username: 'root',
      password: 'example',
      authSource: 'admin',
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
