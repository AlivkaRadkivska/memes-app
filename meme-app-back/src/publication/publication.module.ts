import { Module } from '@nestjs/common';
import { PublicationService } from './publication.service';
import { PublicationController } from './publication.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublicationEntity } from './publication.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PublicationEntity])],
  providers: [PublicationService],
  controllers: [PublicationController],
  exports: [PublicationService],
})
export class PublicationModule {}
