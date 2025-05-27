import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { OptionalJwtAuthGuard } from 'src/auth/guards/optional-jwt-auth.guard';
import { PaginatedDataDto } from 'src/common-dto/paginated-data.dto';
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

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteOne(@Param() id: string): Promise<void> {
    return this.userService.deleteOne(id);
  }
}
