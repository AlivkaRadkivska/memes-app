import { Module } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { UTApi } from 'uploadthing/server';

@Module({
  providers: [FileUploadService, UTApi],
  exports: [FileUploadService],
})
export class FileUploadModule {}
