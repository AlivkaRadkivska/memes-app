import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
config();

const configService = new ConfigService();

export const jwtOptions = {
  secret: configService.getOrThrow<string>('JWT_SECRET'),
  expiresIn: configService.getOrThrow<string>('JWT_EXPIRES_IN'),
};
