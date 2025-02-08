import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentEntity } from './comment.entity';
import { FileUploadModule } from 'src/file-upload/file-upload.module';

@Module({
  imports: [TypeOrmModule.forFeature([CommentEntity]), FileUploadModule],
  providers: [CommentService],
  controllers: [CommentController],
})
export class CommentModule {}
