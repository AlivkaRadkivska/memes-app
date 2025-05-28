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
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { OptionalJwtAuthGuard } from 'src/auth/guards/optional-jwt-auth.guard';
import { PaginatedDataDto } from 'src/common-dto/paginated-data.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserFiltersDto } from './dto/user-filters.dto';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(OptionalJwtAuthGuard)
  @Get()
  getAll(
    @GetUser() user?: UserEntity,
    @Query() filters?: UserFiltersDto,
  ): Promise<PaginatedDataDto<UserEntity>> {
    return this.userService.getAll(user, filters);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(OptionalJwtAuthGuard)
  @Get('email/:email')
  getByEmail(
    @Param('email') email: string,
    @GetUser() user?: UserEntity,
  ): Promise<UserEntity> {
    return this.userService.getOne({ email }, user);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(OptionalJwtAuthGuard)
  @Get('id/:id')
  getById(
    @Param('id') id: string,
    @GetUser() user?: UserEntity,
  ): Promise<UserEntity> {
    return this.userService.getOne({ id }, user);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(OptionalJwtAuthGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  @Patch('/update')
  updateOne(
    @Body() updateUserDto: UpdateUserDto,
    @GetUser() user: UserEntity,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'image/*' })],
        fileIsRequired: false,
      }),
    )
    picture: Express.Multer.File,
  ): Promise<Partial<UserEntity>> {
    return this.userService.updateOne(user, updateUserDto, picture);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteOne(@Param() id: string): Promise<void> {
    return this.userService.deleteOne(id);
  }
}
