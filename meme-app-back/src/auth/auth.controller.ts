import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  HttpCode,
  HttpStatus,
  ParseFilePipe,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
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
  @UseInterceptors(FileInterceptor('avatar'))
  @Post('signup')
  signUp(
    @Body() signUpCredentialsDto: SignUpCredentialsDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'image/*' })],
        fileIsRequired: false,
      }),
    )
    picture: Express.Multer.File,
  ): Promise<AuthResultDto> {
    return this.authService.signUp(signUpCredentialsDto, picture);
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
