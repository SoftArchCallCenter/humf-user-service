import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {User} from "./entities/user.entity";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private UserRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    const currentDate = new Date()
    let newUser = this.UserRepository.create({
      ...createUserDto,
      createAt: currentDate,
      updateAt: currentDate,
    }) 
    return this.UserRepository.save(newUser)
  }

  async findAll() {
    const users = await this.UserRepository.find()
    return users;
  }

  async findOne(id: number) {
    const user = await this.UserRepository.findOneBy({ id })
    return user
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const updateAt = new Date()
    const updateUser = await this.UserRepository.update({ id },{ 
      ...updateUserDto,
      updateAt
    })
    // console.log(updateUser)
    return this.UserRepository.findOneBy({ id })
  }

  async remove(id: number) {
    this.UserRepository.delete({id})
    return {}
  }
}
