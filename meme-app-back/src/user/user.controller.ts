import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import { PaginatedDataDto } from 'src/common-dto/paginated-data.dto';
import { UserFiltersDto } from './dto/user-filters.dto';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  getAll(
    @Query() filters?: UserFiltersDto,
  ): Promise<PaginatedDataDto<UserEntity>> {
    return this.userService.getAll(filters);
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  getById(@Param() id: string): Promise<UserEntity> {
    return this.userService.getOne(id);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteOne(@Param() id: string): Promise<void> {
    return this.userService.deleteOne(id);
  }
}
