import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsOptional,
  IsString,
  ValidateIf,
  IsBoolean,
} from 'class-validator';

import { Tag } from '@src/tags/domain/tag';

export class CreateArticleDto {
  @ApiProperty()
  @IsString()
  body: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  autoGenerateTitle?: boolean;

  @ApiPropertyOptional()
  @ValidateIf((o) => !o.autoGenerateTitle)
  @IsString()
  title: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tagList?: Tag['name'][];
}
