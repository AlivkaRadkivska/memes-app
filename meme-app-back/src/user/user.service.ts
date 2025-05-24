import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginatedDataDto } from 'src/common-dto/paginated-data.dto';
import { FileUploadService } from 'src/file-upload/file-upload.service';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserFiltersDto } from './dto/user-filters.dto';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private fileUploadService: FileUploadService,
  ) {}

  async getAll(
    filters?: UserFiltersDto,
  ): Promise<PaginatedDataDto<UserEntity>> {
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

    const limit = Number(filters?.limit) || 10;
    const page = Number(filters?.page) || 1;
    const offset = (page - 1) * limit;

    query.take(limit).skip(offset);

    const [users, total] = await query.getManyAndCount();

    return {
      items: users,
      totalItems: total,
      limit,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getOne(id?: string, email?: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      relations: ['followers', 'followings'],
      where: [{ id }, { email }],
    });
    if (!user) throw new NotFoundException('Користувача не знайдено');

    return user;
  }

  async createOne(
    createUserDto: CreateUserDto,
    picture?: Express.Multer.File,
  ): Promise<UserEntity> {
    try {
      const user = this.userRepository.create(createUserDto);

      if (picture) {
        const pictureUrl = await this.fileUploadService.uploadFiles([picture]);
        user.avatar = pictureUrl[0];
      }

      await this.userRepository.save(user);

      return user;
    } catch (error) {
      if (error.code == 23505)
        throw new ConflictException(['Email вже зайнятий']);
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
