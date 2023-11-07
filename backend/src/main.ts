import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    'origin': '*'
  })
  console.log('MONGODB_HOST => ', process.env.MONGODB_HOST)
  await app.listen(process.env.APP_PORT);
}
bootstrap();
