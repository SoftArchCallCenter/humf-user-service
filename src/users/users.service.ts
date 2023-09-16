import { Injectable } from '@nestjs/common';
import { User, UserId, UserList } from 'humf-proto/build/proto/user';

@Injectable()
export class UsersService {
  create(user: User): User {
    const newUser: User = {
      id: '1',
      username: 'john_doe',
      password: 'hashed_password',
      email: 'john@example.com',
      photoUrl: 'https://example.com/john.jpg',
    };
    return newUser;
  }

  findAll(): UserList{
    const newUser: User = {
      id: '1',
      username: 'john_doe',
      password: 'hashed_password',
      email: 'john@example.com',
      photoUrl: 'https://example.com/john.jpg',
    };
    const userList: UserList = { User: [newUser, newUser] }; // Wrap the user array in a UserList object
    console.log(typeof(userList))
    return userList;
  }

  findOne(id: string): User{
    const newUser: User = {
      id: '1',
      username: 'john_doe',
      password: 'hashed_password',
      email: 'john@example.com',
      photoUrl: 'https://example.com/john.jpg',
    };
    return newUser;
  }

  update(userId: string, user: User): User{
    const newUser: User = {
      id: '1',
      username: 'john_doe',
      password: 'hashed_password',
      email: 'john@example.com',
      photoUrl: 'https://example.com/john.jpg',
    };
    return newUser;
  }

  remove(userId: string) {
    return {};
  }
}
