import { ConfigService } from '@nestjs/config';
import { ThrottlerModuleOptions } from '@nestjs/throttler';

export function getThrottlerOptions(
  configService: ConfigService,
): ThrottlerModuleOptions {
  return {
    throttlers: [
      {
        ttl: configService.getOrThrow<number>('THROTTLER_TTL'),
        limit: configService.getOrThrow<number>('THROTTLER_LIMIT'),
      },
    ],
    errorMessage: 'Too many requests, please try again later.',
  };
}
