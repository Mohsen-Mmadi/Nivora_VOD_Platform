
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @IsString({ message: 'نام دسته‌بندی باید متن باشد' })
  @IsNotEmpty({ message: 'نام دسته‌بندی نمی‌تواند خالی باشد' })
  @MinLength(2, { message: 'نام دسته‌بندی باید حداقل ۲ کاراکتر باشد' })
  name: string;

  @IsString({ message: 'اسلاگ باید متن باشد' })
  @IsNotEmpty({ message: 'اسلاگ نمی‌تواند خالی باشد' })
  slug: string;
}
