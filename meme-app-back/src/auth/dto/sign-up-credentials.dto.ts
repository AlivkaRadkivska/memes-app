import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class SignUpCredentialsDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(2)
  username: string;

  @IsNotEmpty()
  @MinLength(4)
  password: string;

  @IsNotEmpty()
  @MinLength(4)
  repeatPassword: string;

  @IsOptional()
  fullName: string;

  @IsOptional()
  birthday: Date;
}
