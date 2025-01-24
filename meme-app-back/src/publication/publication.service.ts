import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PublicationEntity } from './publication.entity';
import { Repository } from 'typeorm';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { UserEntity } from 'src/user/user.entity';
import { ShowPublicationDto } from 'src/publication/dto/show-publication.dto';
import { plainToInstance } from 'class-transformer';
import { UpdatePublicationDto } from './dto/update-publication.dto';
import { FileUploadService } from 'src/file-upload/file-upload.service';

@Injectable()
export class PublicationService {
  constructor(
    @InjectRepository(PublicationEntity)
    private publicationRepository: Repository<PublicationEntity>,
    private fileUploadService: FileUploadService,
  ) {}

  async getAll(user: UserEntity = undefined) {
    const publications = await this.publicationRepository.find({
      relations: ['author', 'likes'],
    });

    publications.forEach((publication) => publication.setIsLiked(user));

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
    const pictureUrls = await this.fileUploadService.uploadFiles(pictures);

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
        ? await this.fileUploadService.uploadFiles(pictures)
        : publication.pictures;

    if (pictures?.length > 0)
      await this.fileUploadService.deleteFiles(publication.pictures);

    const updatedPublication = {
      ...publication,
      ...updatePublicationDto,
      lastUpdatedAt: new Date(Date.now()).toISOString(),
      pictures: newPictures,
    };

    await this.publicationRepository.save(updatedPublication);

    return plainToInstance(ShowPublicationDto, updatedPublication, {
      excludeExtraneousValues: true,
    });
  }

  async deleteOne(id: string, user: UserEntity): Promise<void> {
    const publication = await this.getOne(id, user.id);

    await this.fileUploadService.deleteFiles(publication.pictures);

    await this.publicationRepository.delete({ id, author: user });
  }
}
