import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SignUpCredentialsDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(2, { message: 'Мінімальний нікнейм - 2 символи' })
  @MaxLength(15, { message: 'Максимальний нікнейм - 15 символів' })
  username: string;

  @IsNotEmpty()
  @MinLength(4, { message: 'Мінімальний пароль - 4 символи' })
  password: string;

  @IsNotEmpty()
  @MinLength(4, { message: 'Мінімальний пароль - 4 символи' })
  repeatPassword: string;

  @IsOptional()
  @MaxLength(30, { message: "Максимальне повне ім'я - 30 символів" })
  fullName: string;

  @IsOptional()
  birthday: Date;
}
