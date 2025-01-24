import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PublicationEntity } from './publication.entity';
import { Repository } from 'typeorm';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { UserEntity } from 'src/user/user.entity';
import { UpdatePublicationDto } from './dto/update-publication.dto';
import { FileUploadService } from 'src/file-upload/file-upload.service';

@Injectable()
export class PublicationService {
  constructor(
    @InjectRepository(PublicationEntity)
    private publicationRepository: Repository<PublicationEntity>,
    private fileUploadService: FileUploadService,
  ) {}

  async getAll(user: UserEntity = undefined): Promise<PublicationEntity[]> {
    const publications = await this.publicationRepository.find({
      relations: ['likes', 'comments'],
    });

    publications.forEach((publication) => publication.setIsLiked(user));

    return publications;
  }

  async getOne(
    id: string,
    authorId: string = undefined,
  ): Promise<PublicationEntity> {
    const publication = await this.publicationRepository.findOne({
      relations: ['author'],
      where: { id, author: { id: authorId } },
    });

    if (!publication) throw new NotFoundException('Publication was not found');

    return publication;
  }

  async createOne(
    createPublicationDto: CreatePublicationDto,
    user: UserEntity,
    pictures: Express.Multer.File[],
  ): Promise<PublicationEntity> {
    const pictureUrls = await this.fileUploadService.uploadFiles(pictures);

    const publication = this.publicationRepository.create({
      ...createPublicationDto,
      pictures: pictureUrls,
      author: user,
    });
    await this.publicationRepository.save(publication);

    return publication;
  }

  async updateOne(
    id: string,
    updatePublicationDto: UpdatePublicationDto,
    user: UserEntity,
    pictures: Express.Multer.File[] = undefined,
  ): Promise<PublicationEntity> {
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

    return publication;
  }

  async deleteOne(id: string, user: UserEntity): Promise<void> {
    const publication = await this.getOne(id, user.id);

    await this.fileUploadService.deleteFiles(publication.pictures);
    await this.publicationRepository.delete({ id, author: user });
  }
}
