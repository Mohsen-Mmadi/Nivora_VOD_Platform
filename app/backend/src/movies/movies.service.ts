import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { QueryMoviesDto } from './dto/query-movies.dto';
import { Prisma } from '@prisma/client';

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
  async findAll(query: QueryMoviesDto) {
    // مقدارهای پیش‌فرض
    const page = query.page ?? 1;
    const limit = query.limit ?? 12;

    // تعداد رکوردهایی که باید از ابتدای نتیجه رد شوند
    const skip = (page - 1) * limit;
    const take = limit;

    // مرتب‌سازی بر اساس ورودی‌های کوئری یا پیش‌فرض
    const sortBy = query.sortBy ?? 'createdAt';
    const sortOrder = query.sortOrder ?? 'desc';

    // ساخت فیلترهای Prisma به‌صورت کاملاً پویا
    const where: Prisma.MovieWhereInput = {
      ...(query.categoryId ? { categoryId: query.categoryId } : {}),
      ...(query.year ? { year: query.year } : {}),
      // تصحیح منطق جستجو بر اساس فیلد ارسالی از DTO (اینجا از query.search استفاده کردیم)
      ...(query.search
        ? {
            OR: [
              { title: { contains: query.search, mode: 'insensitive' } },
              { description: { contains: query.search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    // اجرای هم‌زمان دو Query با Promise.all برای حداکثر کارایی دیتابیس
    const [data, total] = await Promise.all([
      this.prisma.movie.findMany({
        where,
        skip,
        take,
        orderBy: { [sortBy]: sortOrder }, // مرتب‌سازی پویا بر اساس مقدار ارسالی کاربر
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          sources: {
            where: { isActive: true },
            orderBy: { id: 'asc' }, // حفظ ترتیب ثابت سورس‌ها
          },
        },
      }),
      this.prisma.movie.count({ where }),
    ]);

    // محاسبه تعداد کل صفحات
    const totalPages = Math.ceil(total / limit);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
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

  // پیدا کردن یک فیلم بر اساس اسلاگ (مناسب برای فرانت‌ند Next.js)
  async findBySlug(slug: string) {
    const movie = await this.prisma.movie.findUnique({
      where: { slug },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        sources: {
          where: { isActive: true },
          orderBy: { id: 'asc' },
        },
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

    // د) اعمال تغییرات فیلم
    return this.prisma.movie.update({
      where: { id },
      data: {
        ...movieData,
        // توجه: مدیریت سورس‌ها در آپدیت به صورت جداگانه از طریق سرویس VideoSources انجام می‌شود
      },
      include: {
        category: true,
        sources: true,
      },
    });
  }

  // ۵. حذف فیلم (با توجه به Cascade Delete، سورس‌های متصل خودکار حذف می‌شوند)
  async remove(id: number) {
    await this.findOne(id);

    await this.prisma.movie.delete({
      where: { id },
    });

    return { message: 'فیلم و منابع ویدیویی آن با موفقیت حذف شدند' };
  }
}
