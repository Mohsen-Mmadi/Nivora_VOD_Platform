import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateVideoSourceDto } from './dto/create-video-source.dto';
import { UpdateVideoSourceDto } from './dto/update-video-source.dto';

@Injectable()
export class VideoSourcesService {
  constructor(private readonly prisma: PrismaService) {}

  // ۱. ایجاد یک منبع ویدیویی جدید برای یک فیلم خاص
  async create(dto: CreateVideoSourceDto) {
    // بررسی وجود فیلم قبل از انتساب سورس
    const movie = await this.prisma.movie.findUnique({
      where: { id: dto.movieId },
    });
    if (!movie) {
      throw new NotFoundException('فیلم مورد نظر یافت نشد');
    }

    return this.prisma.videoSource.create({
      data: dto,
    });
  }

  // ۲. دریافت تمام منابع ویدیویی ثبت شده (به همراه اطلاعات فیلم متصل به آن)
  async findAll() {
    return this.prisma.videoSource.findMany({
      include: {
        movie: {
          select: { id: true, title: true, slug: true },
        },
      },
    });
  }

  // ۳. پیدا کردن یک منبع ویدیویی خاص با ID
  async findOne(id: number) {
    const source = await this.prisma.videoSource.findUnique({
      where: { id },
      include: { movie: true },
    });
    if (!source) {
      throw new NotFoundException('منبع ویدیویی مورد نظر یافت نشد');
    }
    return source;
  }

  // ۴. ویرایش جزئیات یک منبع ویدیویی
  async update(id: number, dto: UpdateVideoSourceDto) {
    // ابتدا از وجود سورس مطمئن می‌شویم
    await this.findOne(id);

    // در صورت ارسال movieId جدید، وجود فیلم جدید را چک می‌کنیم
    if (dto.movieId) {
      const movie = await this.prisma.movie.findUnique({
        where: { id: dto.movieId },
      });
      if (!movie) {
        throw new NotFoundException('فیلم جدید معرفی شده یافت نشد');
      }
    }

    return this.prisma.videoSource.update({
      where: { id },
      data: dto,
    });
  }

  // ۵. حذف یک منبع ویدیویی
  async remove(id: number) {
    await this.findOne(id);

    await this.prisma.videoSource.delete({
      where: { id },
    });

    return { message: 'منبع ویدیویی با موفقیت حذف شد' };
  }
}
