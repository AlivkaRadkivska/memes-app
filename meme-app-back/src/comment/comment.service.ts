import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentEntity } from './comment.entity';
import { plainToInstance } from 'class-transformer';
import { ShowCommentDto } from './dto/show-comment.dto';
import { UserEntity } from 'src/user/user.entity';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
  ) {}

  async getAll(): Promise<ShowCommentDto[]> {
    const comments = await this.commentRepository.find();

    return plainToInstance(ShowCommentDto, comments, {
      excludeExtraneousValues: true,
    });
  }

  async getOneById(id: string): Promise<ShowCommentDto> {
    const comment = await this.commentRepository.findOneBy({ id });
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
    const comment = this.commentRepository.create({
      ...createCommentDto,
      user,
    });
    await this.commentRepository.save(comment);
    console.log(picture);

    return plainToInstance(ShowCommentDto, comment, {
      excludeExtraneousValues: true,
    });
  }
}
