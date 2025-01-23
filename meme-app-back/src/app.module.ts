import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configValidationSchema } from './config.schema';
import { UserModule } from './user/user.module';
import { PublicationModule } from './publication/publication.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getDataSourceOptions } from './constants/data-source.constant';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { getThrottlerOptions } from './constants/throttler-options.constant';
import { APP_GUARD } from '@nestjs/core';
import { CommentModule } from './comment/comment.module';
import { FileUploadModule } from './file-upload/file-upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env.STAGE}.local`],
      validationSchema: configValidationSchema,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return getDataSourceOptions(configService);
      },
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        getThrottlerOptions(configService),
    }),
    UserModule,
    PublicationModule,
    AuthModule,
    CommentModule,
    FileUploadModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
