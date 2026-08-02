import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateVideoSourceDto } from './create-video-source.dto';

export class CreateMovieDto {
  @IsString({ message: 'عنوان فیلم باید متن باشد' })
  @IsNotEmpty({ message: 'عنوان فیلم الزامی است' })
  title: string;

  @IsString({ message: 'اسلاگ باید متن باشد' })
  @IsNotEmpty({ message: 'اسلاگ الزامی است' })
  slug: string;

  @IsString({ message: 'توضیحات فیلم باید متن باشد' })
  @IsNotEmpty({ message: 'توضیحات فیلم الزامی است' })
  description: string;

  @IsString({ message: 'آدرس پوستر فیلم باید متن باشد' })
  @IsNotEmpty({ message: 'آدرس پوستر الزامی است' })
  posterUrl: string;

  @IsInt({ message: 'مدت زمان فیلم باید عدد صحیح باشد' })
  @Min(1, { message: 'مدت زمان فیلم باید حداقل ۱ دقیقه باشد' })
  @IsOptional()
  duration?: number;

  @IsInt({ message: 'سال ساخت باید عدد صحیح باشد' })
  @IsOptional()
  year?: number;

  @IsInt({ message: 'شناسه دسته‌بندی باید عدد باشد' })
  @IsNotEmpty({ message: 'شناسه دسته‌بندی الزامی است' })
  categoryId: number;

  @IsArray({ message: 'منابع ویدیو باید به صورت آرایه ارسال شوند' })
  @ValidateNested({ each: true })
  @Type(() => CreateVideoSourceDto)
  @IsOptional()
  sources?: CreateVideoSourceDto[];
}
