import { config } from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

config();

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule, 
    {
      transport: Transport.GRPC,
      options: {
        package: 'user',
        protoPath: 'humf-proto/user.proto',
        url: process.env.GRPC_SERVER_URL,
      },
    }
  );
  await app.listen();
}
bootstrap();
