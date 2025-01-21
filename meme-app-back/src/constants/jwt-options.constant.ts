import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export function getJwtOptions(configService: ConfigService): JwtModuleOptions {
  return {
    global: true,
    secret: configService.getOrThrow<string>('JWT_SECRET'),
    signOptions: {
      expiresIn: configService.getOrThrow<string>('JWT_EXPIRES_IN'),
    },
  };
}
