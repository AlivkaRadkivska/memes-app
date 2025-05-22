import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileUploadModule } from 'src/file-upload/file-upload.module';
import { FollowModule } from 'src/follow/follow.module';
import { PublicationController } from './publication.controller';
import { PublicationEntity } from './publication.entity';
import { PublicationService } from './publication.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PublicationEntity]),
    FileUploadModule,
    FollowModule,
  ],
  providers: [PublicationService],
  controllers: [PublicationController],
  exports: [PublicationService],
})
export class PublicationModule {}
