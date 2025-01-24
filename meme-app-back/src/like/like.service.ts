import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { LikeEntity } from './like.entity';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(LikeEntity)
    private readonly likeRepository: Repository<LikeEntity>,
  ) {}

  async getAll(): Promise<LikeEntity[]> {
    return await this.likeRepository.find();
  }

  async createOne(
    publicationId: string,
    user: UserEntity,
  ): Promise<LikeEntity> {
    try {
      const like = this.likeRepository.create({
        publication: { id: publicationId },
        user,
      });
      await this.likeRepository.save(like);

      return like;
    } catch (error) {
      if (error.code == 23505) throw new ConflictException(['Like exists']);
      else {
        console.log(error);
        throw new InternalServerErrorException();
      }
    }
  }

  async deleteOne(publicationId: string, user: UserEntity): Promise<void> {
    await this.likeRepository.delete({
      publication: { id: publicationId },
      user,
    });
  }
}
