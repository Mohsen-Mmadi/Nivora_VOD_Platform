import { PartialType } from '@nestjs/mapped-types';
import { CreateVideoSourceDto } from './create-video-source.dto';

export class UpdateVideoSourceDto extends PartialType(CreateVideoSourceDto) {}
