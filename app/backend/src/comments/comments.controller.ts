import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  // ثبت کامنت جدید (نیاز به لاگین 🔐)
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createCommentDto: CreateCommentDto, @Req() req: any) {
    // userId را از اطلاعات کاربر درون Request (که گارد JWT آن را پر کرده) استخراج می‌کنیم
    const userId = req.user.userId;
    return this.commentsService.create(userId, createCommentDto);
  }

  // دریافت کامنت‌های یک فیلم خاص (عمومی 🔓)
  @Get('movie/:movieId')
  findAllByMovie(@Param('movieId', ParseIntPipe) movieId: number) {
    return this.commentsService.findAllByMovie(movieId);
  }

  // حذف کامنت (نیاز به لاگین 🔐)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    const userId = req.user.userId;
    return this.commentsService.remove(id, userId);
  }
}
