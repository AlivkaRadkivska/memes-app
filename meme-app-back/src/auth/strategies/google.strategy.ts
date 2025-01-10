import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { UserService } from 'src/user/user.service';
import { config } from 'dotenv';
import { ConfigService } from '@nestjs/config';
config();

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject() private readonly userService: UserService,
    @Inject() private readonly configService: ConfigService,
  ) {
    super({
      clientID: configService.getOrThrow<string>('OAUTH_CLIENT_ID'),
      clientSecret: configService.getOrThrow<string>('OAUTH_CLIENT_SECRET'),
      callbackURL: 'http://localhost:3000/auth/google/redirect',
      scope: ['profile', 'email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    console.log(accessToken);
    console.log(refreshToken);
    console.log(profile);
    const user = await this.userService.getOneByEmail(profile.emails[0].value);
    console.log('Validate');
    console.log(user);
  }
}
