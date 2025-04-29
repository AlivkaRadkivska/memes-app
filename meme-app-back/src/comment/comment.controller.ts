import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseFilePipe,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PaginatedDataDto } from 'src/common-dto/paginated-data.dto';
import { UserEntity } from 'src/user/user.entity';
import { CommentEntity } from './comment.entity';
import { CommentService } from './comment.service';
import { CommentFiltersDto } from './dto/comment-filters.dto';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('comment')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  getComments(
    @Query() filters?: CommentFiltersDto,
  ): Promise<PaginatedDataDto<CommentEntity>> {
    return this.commentService.getAll(filters);
  }

  @HttpCode(HttpStatus.OK)
  @Get('/:id')
  getComment(@Param('id') id: string): Promise<CommentEntity> {
    return this.commentService.getOne(id);
  }

  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('picture'))
  @UseGuards(JwtAuthGuard)
  @Post()
  createComment(
    @Body() createCommentDto: CreateCommentDto,
    @GetUser() user: UserEntity,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'image/*' })],
        fileIsRequired: false,
      }),
    )
    picture: Express.Multer.File,
  ): Promise<CommentEntity> {
    return this.commentService.createOne(createCommentDto, user, picture);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  deleteComment(
    @Param('id') id: string,
    @GetUser() user: UserEntity,
  ): Promise<void> {
    return this.commentService.deleteOne(id, user);
  }
}
