import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';

@Injectable()
export class FavoritesService {
  constructor(private readonly prisma: PrismaService) {}

  // اضافه کردن فیلم به علاقه‌مندی‌ها
  async create(userId: number, dto: CreateFavoriteDto) {
    // ۱. بررسی وجود فیلم
    const movie = await this.prisma.movie.findUnique({
      where: { id: dto.movieId },
    });
    if (!movie) {
      throw new NotFoundException('فیلم مورد نظر یافت نشد');
    }

    // ۲. بررسی اینکه از قبل اضافه نشده باشد
    const existing = await this.prisma.favorite.findUnique({
      where: {
        userId_movieId: {
          userId,
          movieId: dto.movieId,
        },
      },
    });
    if (existing) {
      throw new ConflictException('این فیلم قبلاً در لیست علاقه‌مندی‌های شما ثبت شده است');
    }

    // ۳. ثبت در دیتابیس
    return this.prisma.favorite.create({
      data: {
        userId,
        movieId: dto.movieId,
      },
      include: {
        movie: true, // برگشت دادن اطلاعات فیلم بعد از ذخیره
      },
    });
  }

  // دریافت لیست علاقه‌مندی‌های کاربر لاگین شده
  async findAllMyFavorites(userId: number) {
    return this.prisma.favorite.findMany({
      where: { userId },
      include: {
        movie: {
          include: {
            category: true, // نمایش دسته‌بندی فیلم‌های محبوب
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // حذف فیلم از لیست علاقه‌مندی‌ها
  async remove(userId: number, movieId: number) {
    // بررسی وجود رکورد علاقه‌مندی
    const favorite = await this.prisma.favorite.findUnique({
      where: {
        userId_movieId: {
          userId,
          movieId,
        },
      },
    });

    if (!favorite) {
      throw new NotFoundException('این فیلم در لیست علاقه‌مندی‌های شما وجود ندارد');
    }

    await this.prisma.favorite.delete({
      where: {
        userId_movieId: {
          userId,
          movieId,
        },
      },
    });

    return { message: 'فیلم با موفقیت از لیست علاقه‌مندی‌های شما حذف شد' };
  }
}
