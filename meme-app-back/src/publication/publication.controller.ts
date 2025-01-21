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
import { ShowPublicationDto } from 'src/publication/dto/show-publication.dto';
import { UpdatePublicationDto } from './dto/update-publication.dto';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('publication')
export class PublicationController {
  constructor(private publicationService: PublicationService) {}

  @Post('/upload')
  @UseInterceptors(FilesInterceptor('files'))
  async testUpload(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'image/*' })],
      }),
    )
    files: Express.Multer.File[],
  ) {
    return this.publicationService.uploadFiles(files);
  }

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
  @UseInterceptors(FilesInterceptor('pictures', 12))
  @UseGuards(JwtAuthGuard)
  createPublication(
    @Body() createPublicationDto: CreatePublicationDto,
    @GetUser() user: UserEntity,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'image/*' })],
      }),
    )
    pictures: Express.Multer.File[],
  ): Promise<ShowPublicationDto> {
    return this.publicationService.createOne(
      createPublicationDto,
      user,
      pictures,
    );
  }

  @Patch('/:id')
  updatePublication(
    @Param('id') id: string,
    @Body() updatePublicationDto: UpdatePublicationDto,
    @GetUser() user: UserEntity,
  ): Promise<ShowPublicationDto> {
    return this.publicationService.updateOne(id, updatePublicationDto, user);
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
