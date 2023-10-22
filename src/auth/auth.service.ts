import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import * as argon from 'argon2';
import { LoginUserDto } from 'src/auth/dto/login-user.dto';
import { SignupUserDto } from 'src/auth/dto/signup-user.dto';
import { User } from 'src/users/entities/user.entity';
import { EntityManager, IsNull, Not, Repository } from 'typeorm';
import { JwtPayload, Tokens } from './types';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly entityManager: EntityManager,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    const saltOrRounds = 10;
    return bcrypt.hash(password, saltOrRounds);
  }

  private async hashRtToken(rt: string): Promise<string> {
    return argon.hash(rt);
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersRepository.findOne({
      where: { email: email },
    });
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (user && isPasswordValid) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async signup(userData: SignupUserDto): Promise<Tokens> {
    const hashedPassword = await this.hashPassword(userData.password);
    const newUser = {
      email: userData.email,
      password: hashedPassword,
      username: userData.username,
    };

    const user = new User(newUser);
    await this.entityManager.save(user);

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);

    return tokens;
  }

  async login(credentials: LoginUserDto): Promise<Tokens> {
    const { email, password } = credentials;

    const user = await this.usersRepository.findOne({
      where: { email: email },
    });
    if (!user) throw new ForbiddenException('Access Denied');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);

    return tokens;
  }

  async logout(userId: number): Promise<boolean> {
    await this.usersRepository.update(
      {
        id: userId,
        hashedRt: Not(IsNull()),
      },
      { hashedRt: null },
    );
    return true;
  }

  async refreshTokens(userId: number, rt: string): Promise<Tokens> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user || !user.hashedRt) throw new ForbiddenException('Access Denied');

    const rtMatches = await argon.verify(user.hashedRt, rt);
    if (!rtMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);

    return tokens;
  }

  async updateRtHash(userId: number, rt: string): Promise<void> {
    const hash = await this.hashRtToken(rt);
    const user = await this.usersRepository.findOne({ where: { id: userId } });

    if (user) {
      user.hashedRt = hash;
      await this.entityManager.save(user);
    } else {
      throw new Error('User not found');
    }
  }

  async getTokens(userId: number, email: string): Promise<Tokens> {
    const jwtPayload: JwtPayload = {
      sub: userId,
      email: email,
    };

    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: this.config.get<string>('JWT_AT_SECRET'),
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: this.config.get<string>('JWT_RT_SECRET'),
        expiresIn: '7d',
      }),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }
}
