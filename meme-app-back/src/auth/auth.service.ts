import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { AuthResultDto } from './dto/auth-result.dto';
import * as bcrypt from 'bcrypt';
import { SignInCredentialsDto } from './dto/sign-in-credentials.dto';
import { SignUpCredentialsDto } from './dto/sign-up-credentials.dto';
import { Profile } from 'passport';
import { UserEntity } from 'src/user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    signInCredentialsDto: SignInCredentialsDto,
  ): Promise<AuthResultDto> {
    const { email, password } = signInCredentialsDto;

    const user = await this.userService.getOneByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const accessToken: string = await this.generateToken(user.id, user.email);

      return {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
        },
        accessToken,
      };
    } else throw new UnauthorizedException(['Wrong username or password']);
  }

  async signUp(
    signUpCredentialsDto: SignUpCredentialsDto,
  ): Promise<AuthResultDto> {
    const { password } = signUpCredentialsDto;

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
      },
      accessToken: await this.generateToken(user.id, user.email),
    };
  }

  async loginWithGoogle(profile: Profile): Promise<AuthResultDto> {
    const email = profile.emails[0]?.value;
    let user: UserEntity;

    try {
      user = await this.userService.getOneByEmail(email);
    } catch (error) {
      console.log(error);
      if (error.status == 404) {
        user = await this.userService.createOne({
          email,
          username: email.split('@')[0],
          fullName: profile.displayName,
          role: 'user',
          password: null,
        });
      } else {
        console.log(error);
        throw new InternalServerErrorException();
      }
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      accessToken: await this.generateToken(user.id, user.email),
    };
  }

  async generateToken(id: string, email: string): Promise<string> {
    return await this.jwtService.signAsync({ id, email });
  }

  async getHashedPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(9);
    return await bcrypt.hash(password, salt);
  }
}
