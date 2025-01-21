import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { getJwtOptions } from '../constants/jwt-options.constant';
import { GoogleStrategy } from './strategies/google.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { config } from 'dotenv';
config();

@Module({
  imports: [
    JwtModule.register(getJwtOptions(new ConfigService())),
    UserModule,
    ConfigModule,
    PassportModule.register({ session: false }),
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy],
})
export class AuthModule {}
