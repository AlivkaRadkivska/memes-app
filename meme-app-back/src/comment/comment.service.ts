import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentEntity } from './comment.entity';
import { plainToInstance } from 'class-transformer';
import { ShowCommentDto } from './dto/show-comment.dto';
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

  async getAll(): Promise<ShowCommentDto[]> {
    const comments = await this.commentRepository.find();

    return plainToInstance(ShowCommentDto, comments, {
      excludeExtraneousValues: true,
    });
  }

  async getOne(
    id: string,
    userId: string = undefined,
  ): Promise<ShowCommentDto> {
    const comment = await this.commentRepository.findOne({
      where: [
        { id, user: { id: userId } },
        { id, publication: { author: { id: userId } } },
      ],
    });

    if (!comment) throw new NotFoundException('Comment not found');

    return plainToInstance(ShowCommentDto, comment, {
      excludeExtraneousValues: true,
    });
  }

  async createOne(
    createCommentDto: CreateCommentDto,
    user: UserEntity,
    picture: Express.Multer.File = undefined,
  ): Promise<ShowCommentDto> {
    const pictureUrl = await this.fileUploadService.uploadFiles([picture]);
    const comment = this.commentRepository.create({
      ...createCommentDto,
      picture: pictureUrl[0],
      user,
    });
    await this.commentRepository.save(comment);

    return plainToInstance(ShowCommentDto, comment, {
      excludeExtraneousValues: true,
    });
  }

  async deleteOne(id: string, user: UserEntity): Promise<void> {
    const comment = await this.getOne(id, user.id);

    await this.fileUploadService.deleteFiles([comment.picture]);

    await this.commentRepository.delete({ id: comment.id });
  }
}
