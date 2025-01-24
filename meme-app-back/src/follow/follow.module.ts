import { Module } from '@nestjs/common';
import { FollowController } from './follow.controller';
import { FollowService } from './follow.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FollowEntity } from './follow.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FollowEntity])],
  controllers: [FollowController],
  providers: [FollowService],
})
export class FollowModule {}
