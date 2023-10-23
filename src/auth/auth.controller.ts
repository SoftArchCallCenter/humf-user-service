import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from 'src/auth/dto/login-user.dto';
import { SignupUserDto } from 'src/auth/dto/signup-user.dto';
import { Tokens } from '../common/types';
import { RtGuard } from 'src/common/gaurds';
import { GetCurrentUser, GetCurrentUserId, Public } from 'src/common/decorators';
import { LogoutUserDto } from './dto/logout-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  signup(@Body() signupUserDto: SignupUserDto) {
    return this.authService.signup(signupUserDto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@GetCurrentUserId() userId: number) {
    console.log("Logout");
    return this.authService.logout(userId);
  }
  
  @Public()
  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens(
    @GetCurrentUserId() userId: number,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ): Promise<Tokens> {
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
