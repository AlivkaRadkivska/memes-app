import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PublicationEntity } from './publication.entity';
import { Repository } from 'typeorm';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { UserEntity } from 'src/user/user.entity';
import { ShowPublicationDto } from 'src/publication/dto/show-publication.dto';
import { plainToInstance } from 'class-transformer';
import { UpdatePublicationDto } from './dto/update-publication.dto';
import { UTApi } from 'uploadthing/server';
import { getUploadthingOptions } from 'src/constants/upload-options.constant';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';
import sharp from 'sharp';

@Injectable()
export class PublicationService {
  constructor(
    @InjectRepository(PublicationEntity)
    private publicationRepository: Repository<PublicationEntity>,
  ) {}

  MAX_WIDTH = 1920;
  MAX_HEIGHT = 1080;

  async getAll(): Promise<ShowPublicationDto[]> {
    const publications = await this.publicationRepository.find({
      relations: ['author'],
    });

    return plainToInstance(ShowPublicationDto, publications, {
      excludeExtraneousValues: true,
    });
  }

  async getOneById(id: string): Promise<ShowPublicationDto> {
    const publication = await this.publicationRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!publication) throw new NotFoundException('Publication was not found');

    return plainToInstance(ShowPublicationDto, publication, {
      excludeExtraneousValues: true,
    });
  }

  async createOne(
    createPublicationDto: CreatePublicationDto,
    user: UserEntity,
    pictures: Express.Multer.File[],
  ): Promise<ShowPublicationDto> {
    const pictureUrls = await this.uploadFiles(pictures);

    const publication = this.publicationRepository.create({
      ...createPublicationDto,
      pictures: pictureUrls,
      author: user,
    });
    await this.publicationRepository.save(publication);

    return plainToInstance(ShowPublicationDto, publication, {
      excludeExtraneousValues: true,
    });
  }

  async updateOne(
    id: string,
    updatePublicationDto: UpdatePublicationDto,
    user: UserEntity,
  ): Promise<ShowPublicationDto> {
    const publication = await this.publicationRepository.findOneBy({
      id,
      author: user,
    });

    const updatedPublication = { ...publication, ...updatePublicationDto };
    await this.publicationRepository.save(updatedPublication);

    return plainToInstance(ShowPublicationDto, publication, {
      excludeExtraneousValues: true,
    });
  }

  async deleteOne(id: string, user: UserEntity): Promise<void> {
    const res = await this.publicationRepository.delete({ id, author: user });

    if (res.affected === 0)
      throw new NotFoundException('Publication was not found');
  }

  async uploadFiles(files: Express.Multer.File[]): Promise<string[]> {
    const utapi = new UTApi(getUploadthingOptions(new ConfigService()));

    if (files.length < 1) {
      throw new BadRequestException('No files provided');
    }

    const modifiedFiles = await Promise.all(
      files.map(async (file) => await this.modifyFile(file)),
    );

    try {
      const res = await utapi.uploadFiles(modifiedFiles);

      return res.map((file) => file.data.url);
    } catch (error) {
      console.error('Upload failed:', error);
      throw new InternalServerErrorException(
        'Something went wrong. Please try later',
      );
    }
  }

  async modifyFile(file: Express.Multer.File): Promise<File> {
    const newName = uuid();
    const resizedBuffer = await sharp(file.buffer)
      .resize({
        width: this.MAX_WIDTH,
        height: this.MAX_HEIGHT,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .toBuffer();

    return new File([resizedBuffer], newName, {
      type: file.mimetype,
    });
  }
}
