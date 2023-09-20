import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { SignupUserDto } from 'src/users/dto/signup-user.dto';
import { User } from 'src/users/entities/user.entity';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        private readonly entityManager: EntityManager,
    ) {}

    async signup(userData: SignupUserDto): Promise<User | undefined> {

        const saltOrRounds = 10;
        const hashedPassword = await bcrypt.hash(userData.password, saltOrRounds);
        const newUser = {
            email: userData.email,
            password: hashedPassword,
            username: userData.username,
        };

        const user = new User(newUser);
        await this.entityManager.save(user);

        return user;
    }

    async login(credentials: LoginUserDto): Promise<User | undefined> {
        const { email, password } = credentials;

        const user = await this.usersRepository.findOne({ where: { email } });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return user;
    }
}
