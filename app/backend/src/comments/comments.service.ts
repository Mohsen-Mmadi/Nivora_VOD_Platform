import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  // ایجاد کامنت جدید
  async create(userId: number, dto: CreateCommentDto) {
    // ۱. بررسی وجود فیلم
    const movie = await this.prisma.movie.findUnique({
      where: { id: dto.movieId },
    });
    if (!movie) {
      throw new NotFoundException('فیلم مورد نظر یافت نشد');
    }

    // ۲. ذخیره کامنت متصل به کاربر و فیلم
    return this.prisma.comment.create({
      data: {
        text: dto.text,
        userId: userId,
        movieId: dto.movieId,
      },
      include: {
        user: {
          select: { id: true, name: true, email: true }, // اطلاعات نویسنده کامنت
        },
      },
    });
  }

  // دریافت تمام کامنت‌های یک فیلم خاص
  async findAllByMovie(movieId: number) {
    return this.prisma.comment.findMany({
      where: { movieId },
      include: {
        user: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // پیدا کردن یک کامنت خاص
  async findOne(id: number) {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
    });
    if (!comment) {
      throw new NotFoundException('کامنت مورد نظر یافت نشد');
    }
    return comment;
  }

  // حذف کامنت (فقط نویسنده کامنت مجاز است)
  async remove(id: number, userId: number) {
    const comment = await this.findOne(id);

    // بررسی مالکیت کامنت
    if (comment.userId !== userId) {
      throw new ForbiddenException('شما مجاز به حذف این کامنت نیستید');
    }

    await this.prisma.comment.delete({
      where: { id },
    });

    return { message: 'کامنت با موفقیت حذف شد' };
  }
}
