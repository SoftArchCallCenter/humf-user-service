import { Module } from '@nestjs/common';
import { ImageModule } from '../image/image.module';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([
    User
  ]),
  ImageModule
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
