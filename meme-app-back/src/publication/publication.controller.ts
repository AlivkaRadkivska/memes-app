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
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PublicationService } from './publication.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserEntity } from 'src/user/user.entity';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { UpdatePublicationDto } from './dto/update-publication.dto';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { OptionalJwtAuthGuard } from 'src/auth/guards/optional-jwt-auth.guard';
import { PublicationEntity } from './publication.entity';

@Controller('publication')
export class PublicationController {
  constructor(private publicationService: PublicationService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(OptionalJwtAuthGuard)
  @Get()
  getPublications(
    @GetUser() user: UserEntity = undefined,
  ): Promise<PublicationEntity[]> {
    return this.publicationService.getAll(user);
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
