import { IsNotEmpty, IsEmail, IsDate, IsOptional, IsIn } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;

  @IsOptional()
  fullName: string;

  @IsOptional()
  @IsDate()
  birthday?: Date;

  @IsNotEmpty()
  @IsIn(['user', 'moderator'])
  role: 'user' | 'moderator';
}
