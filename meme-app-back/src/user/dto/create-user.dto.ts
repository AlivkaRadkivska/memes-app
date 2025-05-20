import { IsDate, IsEmail, IsIn, IsNotEmpty, IsOptional } from 'class-validator';
import { UserRole } from './user-role.dto';

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
  @IsIn(['user', 'moderator', 'admin'])
  role: UserRole;
}
