import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

import {} from 'class-transformer';

export class CreateMediaPlatformDto {
  @ApiProperty({
    type: String,
    example: 'yt',
    required: true,
  })
  @IsString()
  code: string;

  @ApiProperty({
    type: String,
    example: 'YouTube',
    required: true,
  })
  @IsString()
  name: string;

  @ApiProperty({
    type: String,
    example: 'youtube',
    required: true,
  })
  @IsString()
  slug: string;

  @ApiProperty({
    type: String,
    example: 'https://youtube.com/',
    required: false,
  })
  @IsOptional()
  @IsString()
  baseUrl?: string;

  @ApiProperty({
    type: String,
    example: 'Video library',
    required: false,
  })
  @IsOptional()
  @IsString()
  note?: string;
}
