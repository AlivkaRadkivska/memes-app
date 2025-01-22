import { ConfigService } from '@nestjs/config';

export function getOauthOptions(configService: ConfigService) {
  return {
    clientID: configService.getOrThrow<string>('OAUTH_CLIENT_ID'),
    clientSecret: configService.getOrThrow<string>('OAUTH_CLIENT_SECRET'),
    callbackURL: configService.getOrThrow<string>('OAUTH_CALLBACK_URL'),
    scope: ['profile', 'email'],
    session: false,
  };
}
