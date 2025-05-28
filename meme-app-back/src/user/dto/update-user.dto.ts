import { IsEmail, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  username?: string;

  @IsOptional()
  password?: string;

  @IsOptional()
  newPassword?: string;

  @IsOptional()
  fullName?: string;

  @IsOptional()
  signature?: string;

  @IsOptional()
  birthday?: Date;
}
