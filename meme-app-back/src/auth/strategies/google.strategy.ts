import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';
import { AuthResultDto } from '../dto/auth-result.dto';
import { getOauthOptions } from 'src/constants/oauth-options.constant';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject() private readonly authService: AuthService) {
    super(getOauthOptions(new ConfigService()));
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): Promise<AuthResultDto> {
    return await this.authService.loginWithGoogle(profile);
  }
}
