import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserEntity } from 'src/user/user.entity';
import { AuthService } from './auth.service';
import { AuthResultDto } from './dto/auth-result.dto';
import { SignInCredentialsDto } from './dto/sign-in-credentials.dto';
import { SignUpCredentialsDto } from './dto/sign-up-credentials.dto';
import { GoogleAuthGuard } from './guards/google-oauth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

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
  async googleRedirect(@Req() req, @Res() res) {
    return res.redirect(await this.authService.handleGoogleRedirect(req.user));
  }
  @HttpCode(HttpStatus.OK)
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req): Promise<UserEntity> {
    return this.authService.getProfile(req.user);
  }
}
