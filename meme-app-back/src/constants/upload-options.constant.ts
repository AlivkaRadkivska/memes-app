import { ConfigService } from '@nestjs/config';
import { RouteHandlerConfig } from 'uploadthing/types';

export function getUploadthingOptions(
  configService: ConfigService,
): RouteHandlerConfig {
  return {
    token: configService.getOrThrow<string>('UPLOADTHING_TOKEN'),
  };
}
