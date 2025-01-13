import { IsNotEmpty, IsEmail } from 'class-validator';

export class SignInCredentialsDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
