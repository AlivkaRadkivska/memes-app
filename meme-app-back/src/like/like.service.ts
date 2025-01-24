import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { UserEntity } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { ShowLikeDto } from './dto/show-like.dto';
import { LikeEntity } from './like.entity';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(LikeEntity)
    private readonly likeRepository: Repository<LikeEntity>,
  ) {}

  async getAll(): Promise<ShowLikeDto[]> {
    const likes = await this.likeRepository.find();

    return plainToInstance(ShowLikeDto, likes, {
      excludeExtraneousValues: true,
    });
  }

  async createOne(
    publicationId: string,
    user: UserEntity,
  ): Promise<ShowLikeDto> {
    try {
      const like = this.likeRepository.create({
        publication: { id: publicationId },
        user,
      });
      await this.likeRepository.save(like);

      return plainToInstance(ShowLikeDto, like, {
        excludeExtraneousValues: true,
      });
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
