import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class FindMoviesQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 12;

  // سرچ روی title/description (یا هرچی بخوای)
  @IsOptional()
  @IsString()
  q?: string;

  // فیلتر بر اساس دسته
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  categoryId?: number;

  // فیلتر بر اساس سال
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1888) // اولین فیلم‌ها :)
  year?: number;
}
