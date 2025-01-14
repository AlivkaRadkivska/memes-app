import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthService } from './auth.service';
import { UserEntity } from 'src/user/user.entity';
import { SignInCredentialsDto } from './dto/sign-in-credentials.dto';
import { SignUpCredentialsDto } from './dto/sign-up-credentials.dto';
import { GoogleAuthGuard } from './guards/google-oauth.guard';
import { AuthResultDto } from './dto/auth-result.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(
    @Body() signInCredentialsDto: SignInCredentialsDto,
  ): Promise<AuthResultDto> {
    return this.authService.signIn(signInCredentialsDto);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  signUp(
    @Body() signUpCredentialsDto: SignUpCredentialsDto,
  ): Promise<AuthResultDto> {
    return this.authService.signUp(signUpCredentialsDto);
  }

  @HttpCode(HttpStatus.OK)
  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  signInWithGoogle(): void {}

  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  getGoogleRedirect(@Req() req): AuthResultDto {
    return req.user;
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req): UserEntity {
    return req.user;
  }
}
