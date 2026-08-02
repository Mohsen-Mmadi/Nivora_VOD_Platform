import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateFavoriteDto {
  @IsInt({ message: 'شناسه فیلم باید عدد باشد' })
  @IsNotEmpty({ message: 'شناسه فیلم الزامی است' })
  movieId: number;
}
