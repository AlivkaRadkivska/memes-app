import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class SignUpCredentialsDto {
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
  birthday: Date;
}
