import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configValidationSchema } from './config.schema';
import { UserModule } from './user/user.module';
import { PublicationModule } from './publication/publication.module';
import { AuthModule } from './auth/auth.module';
import { getDataSourceOptions } from 'db/data-source';
import { TypeOrmModule } from '@nestjs/typeorm';

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
    UserModule,
    PublicationModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
