import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async getAll(): Promise<UserEntity[]> {
    const users = await this.userRepository.find({
      relations: ['followers', 'followings'],
    });

    return users;
  }

  async getOne(
    id: string = undefined,
    email: string = undefined,
  ): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      relations: ['followers', 'followings'],
      where: [{ id }, { email }],
    });
    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async createOne(createUserDto: CreateUserDto): Promise<UserEntity> {
    try {
      const user = this.userRepository.create(createUserDto);
      await this.userRepository.save(user);

      return user;
    } catch (error) {
      if (error.code == 23505)
        throw new ConflictException(['Email is already taken']);
      else {
        console.log(error);
        throw new InternalServerErrorException();
      }
    }
  }

  async deleteOne(id: string): Promise<void> {
    const res = await this.userRepository.delete({ id });

    if (res.affected === 0) throw new NotFoundException();
  }
}
