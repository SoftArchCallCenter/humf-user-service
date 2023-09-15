import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule, 
    {
      transport: Transport.GRPC,
      options: {
        package: 'user',
        protoPath: 'humf-proto/user.proto',
      },
    }
  );
  await app.listen();
}
bootstrap();
