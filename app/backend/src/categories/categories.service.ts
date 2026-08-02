import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  // تزریق وابستگی دیتابیس از طریق Constructor
  constructor(private readonly prisma: PrismaService) {}

  // ۱. ساخت دسته‌بندی جدید
  async create(dto: CreateCategoryDto) {
    // بررسی تکراری نبودن نام دسته‌بندی
    const existingName = await this.prisma.category.findUnique({
      where: { name: dto.name },
    });
    if (existingName) {
      throw new ConflictException('نام دسته‌بندی قبلاً ثبت شده است');
    }

    // بررسی تکراری نبودن اسلاگ
    const existingSlug = await this.prisma.category.findUnique({
      where: { slug: dto.slug },
    });
    if (existingSlug) {
      throw new ConflictException('اسلاگ (slug) قبلاً ثبت شده است');
    }

    // ذخیره در دیتابیس
    return this.prisma.category.create({
      data: {
        name: dto.name,
        slug: dto.slug,
      },
    });
  }

  // ۲. نمایش لیست تمام دسته‌بندی‌ها
  async findAll() {
    return this.prisma.category.findMany({
      orderBy: { createdAt: 'desc' }, // جدیدترین‌ها بالا باشند
    });
  }

  // ۳. نمایش یک دسته‌بندی خاص با استفاده از ID
  async findOne(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('دسته‌بندی مورد نظر یافت نشد');
    }

    return category;
  }

  // ۴. ویرایش دسته‌بندی
  async update(id: number, dto: UpdateCategoryDto) {
    // ابتدا مطمئن می‌شویم دسته‌بندی وجود دارد
    await this.findOne(id);

    // اگر نام جدید ارسال شده، تکراری نبودنش را چک می‌کنیم
    if (dto.name) {
      const existingName = await this.prisma.category.findUnique({
        where: { name: dto.name },
      });
      if (existingName && existingName.id !== id) {
        throw new ConflictException('نام دسته‌بندی قبلاً ثبت شده است');
      }
    }

    // اگر اسلاگ جدید ارسال شده، تکراری نبودنش را چک می‌کنیم
    if (dto.slug) {
      const existingSlug = await this.prisma.category.findUnique({
        where: { slug: dto.slug },
      });
      if (existingSlug && existingSlug.id !== id) {
        throw new ConflictException('اسلاگ (slug) قبلاً ثبت شده است');
      }
    }

    // اعمال آپدیت در دیتابیس
    return this.prisma.category.update({
      where: { id },
      data: dto,
    });
  }

  // ۵. حذف دسته‌بندی
  async remove(id: number) {
    // ابتدا مطمئن می‌شویم دسته‌بندی وجود دارد
    await this.findOne(id);

    // حذف از دیتابیس
    await this.prisma.category.delete({
      where: { id },
    });

    return { message: 'دسته‌بندی با موفقیت حذف شد' };
  }
}
