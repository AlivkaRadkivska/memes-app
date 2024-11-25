import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configValidationSchema } from './config.schema';
import { PublicationModule } from './publication/publication.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env.STAGE}.local`],
      validationSchema: configValidationSchema,
    }),
    PublicationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
