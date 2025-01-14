import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ShowUserDto } from './dto/show-user.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  getAll(): Promise<ShowUserDto[]> {
    return this.userService.getAll();
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  getById(@Param() id: string): Promise<ShowUserDto> {
    return this.userService.getOneById(id);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteOne(@Param() id: string): Promise<void> {
    return this.userService.deleteOne(id);
  }
}
