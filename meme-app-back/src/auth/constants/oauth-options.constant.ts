import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
config();

const configService = new ConfigService();

export const oauthOptions = {
  clientID: configService.getOrThrow<string>('OAUTH_CLIENT_ID'),
  clientSecret: configService.getOrThrow<string>('OAUTH_CLIENT_SECRET'),
  callbackURL: configService.getOrThrow<string>('OAUTH_CALLBACK_URL'),
  scope: ['profile', 'email'],
};
