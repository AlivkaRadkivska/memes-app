import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PublicationService } from './publication.service';
import { PublicationEntity } from './publication.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserEntity } from 'src/user/user.entity';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { ShowPublicationDto } from 'src/publication/dto/show-publication.dto';

@Controller('publication')
export class PublicationController {
  constructor(private publicationService: PublicationService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  getPublications(): Promise<ShowPublicationDto[]> {
    return this.publicationService.getAll();
  }

  @HttpCode(HttpStatus.OK)
  @Get('/:id')
  getPublication(@Param('id') id: string): Promise<ShowPublicationDto> {
    return this.publicationService.getOneById(id);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  @UseGuards(JwtAuthGuard)
  createPublication(
    @Body() createPublicationDto: CreatePublicationDto,
    @GetUser() user: UserEntity,
  ): Promise<PublicationEntity> {
    return this.publicationService.createOne(createPublicationDto, user);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  deletePublication(
    @Param('id') id: string,
    @GetUser() user: UserEntity,
  ): Promise<void> {
    return this.publicationService.deleteOne(id, user);
  }
}
