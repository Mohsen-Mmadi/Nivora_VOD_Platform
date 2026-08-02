import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Injectable()
export class MoviesService {
  constructor(private readonly prisma: PrismaService) {}

  // ۱. ایجاد فیلم جدید به همراه منابع ویدیو (در صورت ارسال)
  async create(dto: CreateMovieDto) {
    // الف) چک کردن تکراری نبودن اسلاگ فیلم
    const existingMovie = await this.prisma.movie.findUnique({
      where: { slug: dto.slug },
    });
    if (existingMovie) {
      throw new ConflictException('اسلاگ فیلم تکراری است');
    }

    // ب) چک کردن وجود دسته‌بندی معرفی شده
    const category = await this.prisma.category.findUnique({
      where: { id: dto.categoryId },
    });
    if (!category) {
      throw new NotFoundException('دسته‌بندی معرفی شده یافت نشد');
    }

    // ج) ذخیره فیلم و منابع ویدیو به صورت تراکنشی (Nested Writes)
    const { sources, ...movieData } = dto;

    return this.prisma.movie.create({
      data: {
        ...movieData,
        sources: sources
          ? {
              create: sources,
            }
          : undefined,
      },
      include: {
        category: true,
        sources: true,
      },
    });
  }

  // ۲. دریافت لیست همه فیلم‌ها با فیلترها یا به صورت ساده
  async findAll() {
    return this.prisma.movie.findMany({
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
        sources: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ۳. پیدا کردن یک فیلم بر اساس شناسه (ID)
  async findOne(id: number) {
    const movie = await this.prisma.movie.findUnique({
      where: { id },
      include: {
        category: true,
        sources: true,
      },
    });

    if (!movie) {
      throw new NotFoundException('فیلم مورد نظر یافت نشد');
    }

    return movie;
  }

  // ۴. ویرایش اطلاعات فیلم
  async update(id: number, dto: UpdateMovieDto) {
    // الف) بررسی وجود فیلم
    await this.findOne(id);

    // ب) بررسی تکراری نبودن اسلاگ در صورت تغییر
    if (dto.slug) {
      const existingSlug = await this.prisma.movie.findUnique({
        where: { slug: dto.slug },
      });
      if (existingSlug && existingSlug.id !== id) {
        throw new ConflictException('اسلاگ فیلم تکراری است');
      }
    }

    // ج) بررسی وجود دسته‌بندی در صورت تغییر
    if (dto.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: dto.categoryId },
      });
      if (!category) {
        throw new NotFoundException('دسته‌بندی معرفی شده یافت نشد');
      }
    }

    const { sources, ...movieData } = dto;

    // د) اعمال تغییرات فیلم (مدیریت ویرایش سورس‌ها را در مرحله بعد جداگانه انجام می‌دهیم یا همینجا اعمال می‌کنیم)
    return this.prisma.movie.update({
      where: { id },
      data: {
        ...movieData,
        // توجه: برای ویرایش سورس‌ها، بعداً روت‌های مجزا می‌نویسیم تا ادمین راحت‌تر مدیریت کند
      },
      include: {
        category: true,
        sources: true,
      },
    });
  }

  // ۵. حذف فیلم (با توجه به onDelete: Cascade در پریزما، سورس‌های متصل به آن خودکار حذف می‌شوند)
  async remove(id: number) {
    await this.findOne(id);

    await this.prisma.movie.delete({
      where: { id },
    });

    return { message: 'فیلم و منابع ویدیویی آن با موفقیت حذف شدند' };
  }
}
