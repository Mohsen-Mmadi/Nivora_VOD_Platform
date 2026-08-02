import { Module } from '@nestjs/common';
import { VideoSourcesService } from './video-sources.service';
import { VideoSourcesController } from './video-sources.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [VideoSourcesController],
  providers: [VideoSourcesService,PrismaService],
})
export class VideoSourcesModule {}
