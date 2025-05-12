import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Profile } from 'passport';
import { getClientUrl } from 'src/constants/client-url.constant';
import { UserRole } from 'src/user/dto/user-role.dto';
import { UserEntity } from 'src/user/user.entity';
import { UserService } from './../user/user.service';
import { AuthResultDto } from './dto/auth-result.dto';
import { SignInCredentialsDto } from './dto/sign-in-credentials.dto';
import { SignUpCredentialsDto } from './dto/sign-up-credentials.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async getProfile(user: Partial<UserEntity>): Promise<UserEntity> {
    return this.userService.getOne(user.id);
  }

  async signIn(
    signInCredentialsDto: SignInCredentialsDto,
  ): Promise<AuthResultDto> {
    const { email, password } = signInCredentialsDto;

    const user = await this.userService.getOne(undefined, email);

    if (!user)
      throw new UnauthorizedException(['Користувач не зареєстрований']);

    if (!user.password)
      throw new UnauthorizedException([
        'Користувач зареєстрований лише через Google',
      ]);

    if (await bcrypt.compare(password, user.password)) {
      const accessToken: string = await this.generateToken(
        user.id,
        user.email,
        user.role,
      );

      return {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
        },
        accessToken,
      };
    } else throw new UnauthorizedException(['Неправильний пароль']);
  }

  async signUp(
    signUpCredentialsDto: SignUpCredentialsDto,
  ): Promise<AuthResultDto> {
    const { password, repeatPassword } = signUpCredentialsDto;

    if (password != repeatPassword)
      throw new BadRequestException('Пароль має співпадати');

    const hashedPassword = await this.getHashedPassword(password);

    const user = await this.userService.createOne({
      ...signUpCredentialsDto,
      password: hashedPassword,
      role: 'user',
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
      accessToken: await this.generateToken(user.id, user.email, user.role),
    };
  }

  async loginWithGoogle(profile: Profile): Promise<AuthResultDto> {
    const email = profile.emails[0]?.value;
    let user: UserEntity;

    try {
      user = await this.userService.getOne(undefined, email);
    } catch (error) {
      console.error(error);
      if (error.status == 404) {
        user = await this.userService.createOne({
          email,
          username: email.split('@')[0],
          fullName: profile.displayName,
          role: 'user',
          password: null,
        });
      } else {
        console.error(error);
        throw new InternalServerErrorException();
      }
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
      accessToken: await this.generateToken(user.id, user.email, user.role),
    };
  }

  async handleGoogleRedirect(data: AuthResultDto): Promise<string> {
    const clientUrl = getClientUrl(new ConfigService());

    const { accessToken, user } = data;
    const redirectUrl = new URL(`${clientUrl}/auth`);

    try {
      if (!accessToken) {
        redirectUrl.searchParams.append('error', '401');
      } else {
        redirectUrl.searchParams.append('token', accessToken);
        redirectUrl.searchParams.append('user', JSON.stringify(user));
      }

      return redirectUrl.toString();
    } catch (err) {
      console.error(err);

      redirectUrl.searchParams.append('error', '500');
      return redirectUrl.toString();
    }
  }

  async generateToken(
    id: string,
    email: string,
    role: UserRole,
  ): Promise<string> {
    return await this.jwtService.signAsync({ id, email, role });
  }

  async getHashedPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(9);
    return await bcrypt.hash(password, salt);
  }
}
