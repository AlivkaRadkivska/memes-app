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
import { ShowUserDto } from './dto/show-user.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async getAll(): Promise<ShowUserDto[]> {
    const users = await this.userRepository.find();

    return plainToInstance(ShowUserDto, users, {
      excludeExtraneousValues: true,
    });
  }

  async getOneForAuth(email: string): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async getOneById(id: string): Promise<ShowUserDto> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found');

    return plainToInstance(ShowUserDto, user, {
      excludeExtraneousValues: true,
    });
  }

  async createOne(createUserDto: CreateUserDto): Promise<ShowUserDto> {
    try {
      const user = this.userRepository.create(createUserDto);
      await this.userRepository.save(user);

      return plainToInstance(ShowUserDto, user, {
        excludeExtraneousValues: true,
      });
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
