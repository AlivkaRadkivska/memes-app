import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { FollowEntity } from './follow.entity';

@Injectable()
export class FollowService {
  constructor(
    @InjectRepository(FollowEntity)
    private readonly followRepository: Repository<FollowEntity>,
  ) {}

  async getAll(): Promise<FollowEntity[]> {
    return await this.followRepository.find();
  }

  async getAllByFollower(followerId: string): Promise<FollowEntity[]> {
    return await this.followRepository.find({
      where: { follower: { id: followerId } },
    });
  }

  async getAllByFollowing(followingId: string): Promise<FollowEntity[]> {
    return await this.followRepository.find({
      where: { following: { id: followingId } },
    });
  }

  async createOne(
    followingId: string,
    follower: UserEntity,
  ): Promise<FollowEntity> {
    if (followingId === follower.id)
      throw new BadRequestException('You can not follow yourself');

    try {
      const follow = this.followRepository.create({
        following: { id: followingId },
        follower,
      });
      await this.followRepository.save(follow);

      return follow;
    } catch (error) {
      if (error.code == 23505)
        throw new ConflictException(['Already following']);
      else {
        console.error(error);
        throw new InternalServerErrorException();
      }
    }
  }

  async deleteOne(followingId: string, follower: UserEntity): Promise<void> {
    await this.followRepository.delete({
      following: { id: followingId },
      follower,
    });
  }
}
