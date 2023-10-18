import { 
  Injectable,
  NotFoundException,
 } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {User} from "./entities/user.entity";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ImageService } from 'src/image/image.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private UserRepository: Repository<User>,
    private readonly imageService: ImageService,
  ) {}

  create(createUserDto: CreateUserDto) {
    let newUser = this.UserRepository.create({
      ...createUserDto,
    });
    return this.UserRepository.save(newUser);
  }

  async findAll() {
    const users = await this.UserRepository.find();
    return users;
  }

  async findOne(id: number) {
    const user = await this.UserRepository.findOneBy({ id });
    return user;
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
    file: Express.Multer.File,
    ): Promise<User> {
    
    const user = await this.UserRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (file) {
      const profilePictureUrl = await this.imageService.uploadImageToS3(file);
      user.profilePictureUrl = profilePictureUrl;
    }

    Object.assign(user, updateUserDto);

    return this.UserRepository.save(user);
  }

  async remove(id: number) {
    this.UserRepository.delete({id})
    return {}
  }
}
