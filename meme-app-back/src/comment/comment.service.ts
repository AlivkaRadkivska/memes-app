import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentEntity } from './comment.entity';
import { UserEntity } from 'src/user/user.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { FileUploadService } from 'src/file-upload/file-upload.service';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
    private fileUploadService: FileUploadService,
  ) {}

  async getAll(): Promise<CommentEntity[]> {
    return await this.commentRepository.find({
      relations: ['user', 'publication'],
    });
  }

  async getOne(id: string, userId?: string): Promise<CommentEntity> {
    const comment = await this.commentRepository.findOne({
      where: [
        { id, user: { id: userId } },
        { id, publication: { author: { id: userId } } },
      ],
    });

    if (!comment) throw new NotFoundException('Comment not found');

    return comment;
  }

  async createOne(
    createCommentDto: CreateCommentDto,
    user: UserEntity,
    picture?: Express.Multer.File,
  ): Promise<CommentEntity> {
    const comment = this.commentRepository.create({
      ...createCommentDto,
      user,
    });

    if (picture) {
      const pictureUrl = await this.fileUploadService.uploadFiles([picture]);
      comment.picture = pictureUrl[0];
    }

    await this.commentRepository.save(comment);

    return comment;
  }

  async deleteOne(id: string, user: UserEntity): Promise<void> {
    const comment = await this.getOne(id, user.id);

    await this.fileUploadService.deleteFiles([comment.picture]);
    await this.commentRepository.delete({ id: comment.id });
  }
}
