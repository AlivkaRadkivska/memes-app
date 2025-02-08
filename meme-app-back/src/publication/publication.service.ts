import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PublicationEntity } from './publication.entity';
import { Repository } from 'typeorm';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { UserEntity } from 'src/user/user.entity';
import { UpdatePublicationDto } from './dto/update-publication.dto';
import { FileUploadService } from 'src/file-upload/file-upload.service';
import { PublicationFiltersDto } from './dto/publication-filters.dto';

@Injectable()
export class PublicationService {
  constructor(
    @InjectRepository(PublicationEntity)
    private publicationRepository: Repository<PublicationEntity>,
    private fileUploadService: FileUploadService,
  ) {}

  async getAll(
    user?: UserEntity,
    filters?: PublicationFiltersDto,
  ): Promise<PublicationEntity[]> {
    const query = this.publicationRepository
      .createQueryBuilder('publication')
      .leftJoinAndSelect('publication.likes', 'likes')
      .leftJoinAndSelect('publication.comments', 'comments')
      .leftJoinAndSelect('publication.author', 'author');

    if (filters?.keywords && filters.keywords.length > 0) {
      query.andWhere(
        'EXISTS (SELECT 1 FROM unnest(publication.keywords) keyword WHERE keyword ILIKE ANY(:keywords))',
        {
          keywords: filters.keywords
            .split(',')
            .map((keyword) => `%${keyword}%`),
        },
      );
    }

    if (filters?.status) {
      query.andWhere('publication.status = :status', {
        status: filters.status,
      });
    }

    if (filters?.isBanned !== undefined) {
      query.andWhere('publication.isBanned = :isBanned', {
        isBanned: filters.isBanned,
      });
    }

    if (filters?.search) {
      query.andWhere(
        '(LOWER(publication.description) LIKE LOWER(:search) OR EXISTS (SELECT 1 FROM unnest(publication.keywords) keyword WHERE LOWER(keyword) LIKE LOWER(:search)))',
        { search: `%${filters.search}%` },
      );
    }

    if (filters?.author) {
      query.andWhere(
        'LOWER(author.username) LIKE LOWER(:author) OR LOWER(author.full_name) LIKE LOWER(:author) OR LOWER(author.email) LIKE LOWER(:author)',
        { author: `%${filters.author}%` },
      );
    }

    if (filters?.createdAtDesc !== undefined) {
      query.orderBy(
        'publication.createdAt',
        filters.createdAtDesc ? 'DESC' : 'ASC',
      );
    }

    const publications = await query.getMany();
    publications.forEach((publication) => publication.setIsLiked(user));

    return publications;
  }

  async getOne(id: string, authorId?: string): Promise<PublicationEntity> {
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
    pictures?: Express.Multer.File[],
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
