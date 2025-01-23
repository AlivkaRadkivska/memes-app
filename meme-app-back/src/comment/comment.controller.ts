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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { UserEntity } from 'src/user/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ShowCommentDto } from './dto/show-comment.dto';

@Controller('comment')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  getComments(): Promise<ShowCommentDto[]> {
    return this.commentService.getAll();
  }

  @HttpCode(HttpStatus.OK)
  @Get('/:id')
  getComment(@Param('id') id: string): Promise<ShowCommentDto> {
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
  ): Promise<ShowCommentDto> {
    return this.commentService.createOne(createCommentDto, user, picture);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  deleteComment(@Param('id') id: string, @GetUser() user: UserEntity) {
    return this.commentService.deleteOne(id, user);
  }
}
