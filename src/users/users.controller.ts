import { Controller } from '@nestjs/common';
import { GrpcMethod, MessagePattern, Payload } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { UserList, User, UserServiceControllerMethods, UserId, Empty } from 'humf-proto/build/proto/user';

@Controller()
@UserServiceControllerMethods()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  getAllUser(): UserList {
    return this.usersService.findAll();
  }

  getUser(userId: UserId): User {
    return this.usersService.findOne(userId.id);
  }

  addUser(user: User): User {
    return this.usersService.create(user);
  }

  updateUser(user: User): User {
    return this.usersService.update(user.id, user);
  }

  deleteUser(userId: UserId): Empty {
    return this.usersService.remove(userId.id);
  }
}