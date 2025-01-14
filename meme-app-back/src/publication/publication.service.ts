import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PublicationEntity } from './publication.entity';
import { Repository } from 'typeorm';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { UserEntity } from 'src/user/user.entity';
import { ShowPublicationDto } from 'src/publication/dto/show-publication.dto';
import { plainToInstance } from 'class-transformer';
import { UpdatePublicationDto } from './dto/update-publication.dto';

@Injectable()
export class PublicationService {
  constructor(
    @InjectRepository(PublicationEntity)
    private publicationRepository: Repository<PublicationEntity>,
  ) {}

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
  ): Promise<ShowPublicationDto> {
    const publication = this.publicationRepository.create({
      ...createPublicationDto,
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
}
