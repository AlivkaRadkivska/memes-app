import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { PaginatedDataDto } from 'src/common-dto/paginated-data.dto';
import { FileUploadService } from 'src/file-upload/file-upload.service';
import { FollowService } from 'src/follow/follow.service';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserFiltersDto } from './dto/user-filters.dto';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private followService: FollowService,
    private fileUploadService: FileUploadService,
  ) {}

  async getAll(
    authUser?: UserEntity,
    filters?: UserFiltersDto,
  ): Promise<PaginatedDataDto<UserEntity>> {
    const query = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.followers', 'followers')
      .leftJoinAndSelect('user.followings', 'followings')
      .leftJoinAndSelect('user.publications', 'publications');

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
    const follows =
      authUser && (await this.followService.getAllByFollower(authUser.id));
    users.forEach(async (user) => {
      user.setIsFollowing(authUser, follows);
    });

    return {
      items: users,
      totalItems: total,
      limit,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getOne(
    params: { id?: string; email?: string },
    authUser?: UserEntity,
  ): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      relations: ['followers', 'followings', 'publications'],
      where: params,
    });

    const follows =
      authUser && (await this.followService.getAllByFollower(authUser.id));
    user.setIsFollowing(authUser, follows);

    if (!user) throw new NotFoundException(['Користувача не знайдено']);

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

  async updateOne(
    user: UserEntity,
    updateUserDto: UpdateUserDto,
    picture?: Express.Multer.File,
  ): Promise<Partial<UserEntity>> {
    try {
      const userInfo = await this.getOne({ id: user.id });

      let avatar = userInfo.avatar;
      if (picture) {
        const pictureUrl = await this.fileUploadService.uploadFiles([picture]);
        avatar = pictureUrl[0];

        userInfo.avatar &&
          (await this.fileUploadService.deleteFiles([userInfo.avatar]));
      }

      let hashedPassword: string = userInfo.password;
      if (updateUserDto.newPassword) {
        if (await bcrypt.compare(userInfo.password, updateUserDto.password))
          hashedPassword = await this.getHashedPassword(
            updateUserDto.newPassword,
          );
        else throw new ConflictException(['Неправильний поточний пароль']);
      }

      const updatedUser = {
        ...userInfo,
        ...updateUserDto,
        lastUpdatedAt: new Date(Date.now()).toISOString(),
        avatar,
        password: hashedPassword,
      };

      await this.userRepository.save(updatedUser);
      return updatedUser;
    } catch (error) {
      console.error(error);

      if (error.code == 23505)
        throw new ConflictException(['Email вже зайнятий']);
      else if (error.status == 409)
        throw new ConflictException(['Неправильний пароль']);
      else {
        console.error(error);
        throw new InternalServerErrorException();
      }
    }
  }

  async deleteOne(id: string): Promise<void> {
    const res = await this.userRepository.delete({ id });

    if (res.affected === 0)
      throw new NotFoundException(['Користувача не знайдено']);
  }

  async getHashedPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(9);
    return await bcrypt.hash(password, salt);
  }
}
