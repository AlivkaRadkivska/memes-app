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
    private utApi: UTApi,
  ) {
    this.utApi = new UTApi(getUploadthingOptions(new ConfigService()));
  }

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

  async getOne(
    id: string,
    authorId: string = undefined,
  ): Promise<ShowPublicationDto> {
    const publication = await this.publicationRepository.findOne({
      relations: ['author'],
      where: { id, author: { id: authorId } },
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
    pictures: Express.Multer.File[] = undefined,
  ): Promise<ShowPublicationDto> {
    const publication = await this.getOne(id, user.id);

    const newPictures =
      pictures?.length > 0
        ? await this.uploadFiles(pictures)
        : publication.pictures;

    if (pictures?.length > 0) await this.deleteFiles(publication.pictures);

    const updatedPublication = {
      ...publication,
      ...updatePublicationDto,
      pictures: newPictures,
    };

    await this.publicationRepository.save(updatedPublication);

    return plainToInstance(ShowPublicationDto, updatedPublication, {
      excludeExtraneousValues: true,
    });
  }

  async deleteOne(id: string, user: UserEntity): Promise<void> {
    const publication = await this.getOne(id, user.id);

    await this.deleteFiles(publication.pictures);

    await this.publicationRepository.delete({ id, author: user });
  }

  async uploadFiles(files: Express.Multer.File[]): Promise<string[]> {
    if (files.length < 1) {
      throw new BadRequestException('No files provided');
    }

    const modifiedFiles = await Promise.all(
      files.map(async (file) => await this.modifyFile(file)),
    );

    try {
      const res = await this.utApi.uploadFiles(modifiedFiles);

      return res.map((file) => file.data.url);
    } catch (error) {
      console.error('Upload failed:', error);
      throw new InternalServerErrorException(
        'Something went wrong. Please try later',
      );
    }
  }

  async deleteFiles(files: string[]): Promise<void> {
    const fileKeys = files.map((file) => file.split('/').at(-1));

    try {
      await this.utApi.deleteFiles(fileKeys);
    } catch (error) {
      console.error('Deleting failed:', error);
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
        fastShrinkOnLoad: true,
      })
      .toBuffer();

    return new File([resizedBuffer], newName, {
      type: file.mimetype,
    });
  }
}
