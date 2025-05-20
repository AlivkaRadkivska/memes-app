import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { CommentModule } from './comment/comment.module';
import { configValidationSchema } from './config.schema';
import { getDataSourceOptions } from './constants/data-source.constant';
import { getThrottlerOptions } from './constants/throttler-options.constant';
import { FileUploadModule } from './file-upload/file-upload.module';
import { FollowModule } from './follow/follow.module';
import { LikeModule } from './like/like.module';
import { PublicationModule } from './publication/publication.module';
import { UserModule } from './user/user.module';

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
    LikeModule,
    FollowModule,
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
