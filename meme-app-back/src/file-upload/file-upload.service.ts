import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import sharp from 'sharp';
import { v4 as uuid } from 'uuid';
import { getUploadthingOptions } from 'src/constants/upload-options.constant';
import { UTApi } from 'uploadthing/server';

@Injectable()
export class FileUploadService {
  MAX_WIDTH = 1920;
  MAX_HEIGHT = 1080;

  constructor(private utApi: UTApi) {
    this.utApi = new UTApi(getUploadthingOptions(new ConfigService()));
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
      throw new InternalServerErrorException();
    }
  }

  async deleteFiles(files: string[]): Promise<void> {
    const fileKeys = files.map((file) => file.split('/').at(-1));

    try {
      await this.utApi.deleteFiles(fileKeys);
    } catch (error) {
      console.error('Deleting failed:', error);
      throw new InternalServerErrorException();
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
