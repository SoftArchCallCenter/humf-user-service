import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AtGuard } from './common/gaurds';

async function bootstrap() {
  const port = process.env.USER_SERVICE_PORT || 5000;
  const host = process.env.USER_SERVICE_host || "127.0.0.1";

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(port, host);
}
bootstrap();
