
import { IsInt, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateCommentDto {
  @IsString({ message: 'متن کامنت باید رشته متنی باشد' })
  @IsNotEmpty({ message: 'متن کامنت نمی‌تواند خالی باشد' })
  @MinLength(3, { message: 'متن کامنت باید حداقل ۳ کاراکتر باشد' })
  text: string;

  @IsInt({ message: 'شناسه فیلم باید عدد صحیح باشد' })
  @IsNotEmpty({ message: 'شناسه فیلم الزامی است' })
  movieId: number;
}
