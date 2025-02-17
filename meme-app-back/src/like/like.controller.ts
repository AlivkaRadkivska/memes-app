import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserEntity } from 'src/user/user.entity';
import { LikeService } from './like.service';
import { LikeEntity } from './like.entity';

@Controller('like')
export class LikeController {
  constructor(private likeService: LikeService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  getLikes(): Promise<LikeEntity[]> {
    return this.likeService.getAll();
  }

  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  @Post('/:publicationId')
  createLike(
    @Param('publicationId') publicationId: string,
    @GetUser() user: UserEntity,
  ): Promise<LikeEntity> {
    return this.likeService.createOne(publicationId, user);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @Delete('/:publicationId')
  deleteLike(
    @Param('publicationId') publicationId: string,
    @GetUser() user: UserEntity,
  ): Promise<void> {
    return this.likeService.deleteOne(publicationId, user);
  }
}
