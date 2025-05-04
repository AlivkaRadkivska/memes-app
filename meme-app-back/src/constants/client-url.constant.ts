import { ConfigService } from '@nestjs/config';

export function getClientUrl(configService: ConfigService): string {
  return configService.getOrThrow<string>('CLIENT_URL');
}
