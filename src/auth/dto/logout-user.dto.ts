import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LogoutUserDto {
  @IsNotEmpty()
  userId: number;
}
