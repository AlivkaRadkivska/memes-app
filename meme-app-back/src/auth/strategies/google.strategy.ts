import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { oauthOptions } from '../constants/oauth-options.constant';
import { AuthService } from '../auth.service';
import { AuthResultDto } from '../dto/auth-result.dto';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject() private readonly authService: AuthService) {
    super({
      clientID: oauthOptions.clientID,
      clientSecret: oauthOptions.clientSecret,
      callbackURL: oauthOptions.callbackURL,
      scope: oauthOptions.scope,
      session: false,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): Promise<AuthResultDto> {
    return await this.authService.loginWithGoogle(profile);
  }
}
