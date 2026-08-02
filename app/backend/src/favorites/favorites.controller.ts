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
import { FavoritesService } from './favorites.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('favorites')
@UseGuards(JwtAuthGuard) // 🔐 کل روت‌های این کنترلر نیاز به لاگین دارند
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  // اضافه کردن به لیست
  @Post()
  create(@Body() createFavoriteDto: CreateFavoriteDto, @Req() req: any) {
    const userId = req.user.userId;
    return this.favoritesService.create(userId, createFavoriteDto);
  }

  // مشاهده لیست علاقه‌مندی‌های خودم
  @Get()
  findAllMyFavorites(@Req() req: any) {
    const userId = req.user.userId;
    return this.favoritesService.findAllMyFavorites(userId);
  }

  // حذف از لیست با گرفتن شناسه فیلم
  @Delete(':movieId')
  remove(
    @Param('movieId', ParseIntPipe) movieId: number,
    @Req() req: any,
  ) {
    const userId = req.user.userId;
    return this.favoritesService.remove(userId, movieId);
  }
}
