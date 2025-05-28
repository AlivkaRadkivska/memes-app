import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { config } from 'dotenv';
import { UserModule } from 'src/user/user.module';
import { getJwtOptions } from '../constants/jwt-options.constant';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './strategies/google.strategy';
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
