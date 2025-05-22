import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginatedDataDto } from 'src/common-dto/paginated-data.dto';
import { FileUploadService } from 'src/file-upload/file-upload.service';
import { UserEntity } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { CommentEntity } from './comment.entity';
import { CommentFiltersDto } from './dto/comment-filters.dto';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
    private fileUploadService: FileUploadService,
  ) {}

  async getAll(
    filters?: CommentFiltersDto,
  ): Promise<PaginatedDataDto<CommentEntity>> {
    const query = this.commentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.user', 'user')
      .leftJoinAndSelect('comment.publication', 'publication');

    if (filters?.publicationId) {
      query.andWhere('publication.id = :publicationId', {
        publicationId: filters.publicationId,
      });
    }

    if (filters?.userId) {
      query.andWhere('user.id = :userId', {
        userId: filters.userId,
      });
    }

    const limit = Number(filters?.limit) || 10;
    const page = Number(filters?.page) || 1;
    const offset = (page - 1) * limit;

    query.take(limit).skip(offset);

    const [comments, total] = await query.getManyAndCount();

    return {
      items: comments,
      totalItems: total,
      limit,
      page,
      totalPages: Math.ceil(total / limit),
    };
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

    if (comment.picture)
      await this.fileUploadService.deleteFiles([comment.picture]);

    await this.commentRepository.delete({ id: comment.id });
  }
}
