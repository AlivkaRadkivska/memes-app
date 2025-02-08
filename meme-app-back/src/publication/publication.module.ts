import { Module } from '@nestjs/common';
import { PublicationService } from './publication.service';
import { PublicationController } from './publication.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublicationEntity } from './publication.entity';
import { FileUploadModule } from 'src/file-upload/file-upload.module';

@Module({
  imports: [TypeOrmModule.forFeature([PublicationEntity]), FileUploadModule],
  providers: [PublicationService],
  controllers: [PublicationController],
  exports: [PublicationService],
})
export class PublicationModule {}
