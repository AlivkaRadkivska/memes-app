import { Module } from '@nestjs/common';
import { PublicationService } from './publication.service';
import { PublicationController } from './publication.controller';

@Module({
  providers: [PublicationService],
  controllers: [PublicationController],
})
export class PublicationModule {}
