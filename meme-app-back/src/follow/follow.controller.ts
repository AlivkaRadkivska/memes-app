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
import { FollowEntity } from './follow.entity';
import { FollowService } from './follow.service';

@Controller('follow')
export class FollowController {
  constructor(private followService: FollowService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  getFollows(): Promise<FollowEntity[]> {
    return this.followService.getAll();
  }

  @HttpCode(HttpStatus.OK)
  @Get('/followers/:id')
  getFollowers(@Param('id') id: string): Promise<FollowEntity[]> {
    return this.followService.getAllByFollowing(id);
  }

  @HttpCode(HttpStatus.OK)
  @Get('/followings/:id')
  getFollowings(@Param('id') id: string): Promise<FollowEntity[]> {
    return this.followService.getAllByFollower(id);
  }

  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  @Post('/:followingId')
  createFollow(
    @Param('followingId') followingId: string,
    @GetUser() follower: UserEntity,
  ): Promise<FollowEntity> {
    return this.followService.createOne(followingId, follower);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @Delete('/:followingId')
  deleteFollow(
    @Param('followingId') followingId: string,
    @GetUser() follower: UserEntity,
  ): Promise<void> {
    return this.followService.deleteOne(followingId, follower);
  }
}
