import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { VideoSourcesService } from './video-sources.service';
import { CreateVideoSourceDto } from './dto/create-video-source.dto';
import { UpdateVideoSourceDto } from './dto/update-video-source.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from '@prisma/client';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('video-sources')
export class VideoSourcesController {
  constructor(private readonly videoSourcesService: VideoSourcesService) {}

  // ایجاد سورس جدید (نیاز به توکن لاگین 🔐)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  create(@Body() createVideoSourceDto: CreateVideoSourceDto) {
    return this.videoSourcesService.create(createVideoSourceDto);
  }

  // دریافت تمام سورس‌ها (عمومی 🔓)
  @Get()
  findAll() {
    return this.videoSourcesService.findAll();
  }

  // دریافت اطلاعات یک سورس خاص (عمومی 🔓)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.videoSourcesService.findOne(id);
  }

  // ویرایش اطلاعات یک سورس (نیاز به توکن لاگین 🔐)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVideoSourceDto: UpdateVideoSourceDto,
  ) {
    return this.videoSourcesService.update(id, updateVideoSourceDto);
  }

  // حذف یک سورس (نیاز به توکن لاگین 🔐)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.videoSourcesService.remove(id);
  }
}
