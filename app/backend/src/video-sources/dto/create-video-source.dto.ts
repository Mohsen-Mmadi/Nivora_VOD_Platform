import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { VideoProvider } from '@prisma/client';

export class CreateVideoSourceDto {
  @IsInt({ message: 'شناسه فیلم باید عدد صحیح باشد' })
  @IsNotEmpty({ message: 'شناسه فیلم الزامی است' })
  movieId: number;

  @IsEnum(VideoProvider, { message: 'پرووایدر ویدیو معتبر نیست (DIRECT, APARAT, YOUTUBE, OTHER)' })
  @IsNotEmpty({ message: 'پرووایدر ویدیو الزامی است' })
  provider: VideoProvider;

  @IsString({ message: 'لینک ویدیو باید متن باشد' })
  @IsNotEmpty({ message: 'لینک ویدیو الزامی است' })
  url: string;

  @IsString({ message: 'کیفیت ویدیو باید متن باشد' })
  @IsOptional()
  quality?: string;

  @IsString({ message: 'زبان ویدیو باید متن باشد' })
  @IsOptional()
  language?: string;
}
