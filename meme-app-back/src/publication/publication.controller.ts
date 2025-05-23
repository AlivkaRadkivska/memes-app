import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from 'src/auth/guards/optional-jwt-auth.guard';
import { PaginatedDataDto } from 'src/common-dto/paginated-data.dto';
import { UserEntity } from 'src/user/user.entity';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { PublicationFiltersDto } from './dto/publication-filters.dto';
import { UpdatePublicationDto } from './dto/update-publication.dto';
import { PublicationEntity } from './publication.entity';
import { PublicationService } from './publication.service';

@Controller('publication')
export class PublicationController {
  constructor(private publicationService: PublicationService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(OptionalJwtAuthGuard)
  @Get()
  getPublications(
    @GetUser() user?: UserEntity,
    @Query() filters?: PublicationFiltersDto,
  ): Promise<PaginatedDataDto<PublicationEntity>> {
    return this.publicationService.getAll(user, filters);
  }

  @HttpCode(HttpStatus.OK)
  @Get('/:id')
  getPublication(@Param('id') id: string): Promise<PublicationEntity> {
    return this.publicationService.getOne(id);
  }

  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FilesInterceptor('pictures', 8))
  @UseGuards(JwtAuthGuard)
  @Post()
  createPublication(
    @Body() createPublicationDto: CreatePublicationDto,
    @GetUser() user: UserEntity,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'image/*' })],
      }),
    )
    pictures: Express.Multer.File[],
  ): Promise<PublicationEntity> {
    return this.publicationService.createOne(
      createPublicationDto,
      user,
      pictures,
    );
  }

  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FilesInterceptor('pictures', 8))
  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  updatePublication(
    @Param('id') id: string,
    @Body() updatePublicationDto: UpdatePublicationDto,
    @GetUser() user: UserEntity,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'image/*' })],
        fileIsRequired: false,
      }),
    )
    pictures: Express.Multer.File[],
  ): Promise<PublicationEntity> {
    return this.publicationService.updateOne(
      id,
      updatePublicationDto,
      user,
      pictures,
    );
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  deletePublication(
    @Param('id') id: string,
    @GetUser() user: UserEntity,
  ): Promise<void> {
    return this.publicationService.deleteOne(id, user);
  }
}
