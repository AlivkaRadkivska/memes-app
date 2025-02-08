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
import { UserFiltersDto } from './dto/user-filters.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async getAll(filters?: UserFiltersDto): Promise<UserEntity[]> {
    const query = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.followers', 'followers')
      .leftJoinAndSelect('user.followings', 'followings');

    if (filters?.isBanned !== undefined) {
      query.andWhere('user.isBanned = :isBanned', {
        isBanned: filters.isBanned,
      });
    }

    if (filters?.email) {
      query.andWhere('LOWER(user.email) LIKE LOWER(:email)', {
        email: `%${filters.email}%`,
      });
    }

    if (filters?.name) {
      query.andWhere(
        'LOWER(user.username) LIKE LOWER(:name) OR LOWER(user.fullName) LIKE LOWER(:name)',
        {
          name: `%${filters.name}%`,
        },
      );
    }

    if (filters?.search) {
      query.andWhere(
        'LOWER(user.username) LIKE LOWER(:search) OR LOWER(user.full_name) LIKE LOWER(:search) OR LOWER(user.email) LIKE LOWER(:search) OR LOWER(user.signature) LIKE LOWER(:search)',
        { search: `%${filters.search}%` },
      );
    }

    const users = await query.getMany();

    return users;
  }

  async getOne(id?: string, email?: string): Promise<UserEntity> {
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
        console.error(error);
        throw new InternalServerErrorException();
      }
    }
  }

  async deleteOne(id: string): Promise<void> {
    const res = await this.userRepository.delete({ id });

    if (res.affected === 0) throw new NotFoundException();
  }
}
