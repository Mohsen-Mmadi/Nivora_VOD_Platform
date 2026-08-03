import { Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class QueryMoviesDto {
  // شماره صفحه؛ اگر ارسال نشود، مقدار پیش‌فرض 1 در سرویس اعمال می‌شود
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'شماره صفحه باید عدد صحیح باشد' })
  @Min(1, { message: 'شماره صفحه باید حداقل ۱ باشد' })
  page?: number;

  // تعداد آیتم‌ها در هر صفحه
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'تعداد آیتم‌ها باید عدد صحیح باشد' })
  @Min(1, { message: 'تعداد آیتم‌ها باید حداقل ۱ باشد' })
  @Max(50, { message: 'حداکثر تعداد فیلم در هر صفحه ۵۰ مورد است' })
  limit?: number;

  // جستجو در عنوان فیلم
  @IsOptional()
  @IsString({ message: 'عبارت جستجو باید متن باشد' })
  search?: string;

  // فیلتر براساس شناسه دسته‌بندی
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'شناسه دسته‌بندی باید عدد صحیح باشد' })
  @Min(1, { message: 'شناسه دسته‌بندی باید بزرگ‌تر از صفر باشد' })
  categoryId?: number;

  // فیلتر براساس سال انتشار فیلم
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'سال تولید باید عدد صحیح باشد' })
  @Min(1888, { message: 'سال تولید معتبر نیست' })
  @Max(2100, { message: 'سال تولید معتبر نیست' })
  year?: number;

  // فیلدی که براساس آن مرتب‌سازی می‌کنیم
  @IsOptional()
  @IsIn(['createdAt', 'year', 'title'], {
    message: 'فیلد مرتب‌سازی فقط می‌تواند createdAt، year یا title باشد',
  })
  sortBy?: 'createdAt' | 'year' | 'title';

  // جهت مرتب‌سازی
  @IsOptional()
  @IsIn(['asc', 'desc'], {
    message: 'ترتیب مرتب‌سازی فقط می‌تواند asc یا desc باشد',
  })
  sortOrder?: 'asc' | 'desc';
}
