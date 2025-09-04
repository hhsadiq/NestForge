import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import {} from 'class-transformer';

export class CreateLanguageDto {
  @ApiProperty({
    type: String,
    example: 'en',
    required: true,
  })
  @IsString()
  code: string;

  @ApiProperty({
    type: String,
    example: 'English',
    required: true,
  })
  @IsString()
  name: string;

  @ApiProperty({
    type: String,
    example: 'ltr',
    required: true,
  })
  @IsString()
  direction: string;

  @ApiProperty({
    type: String,
    example: 'english',
    required: true,
  })
  @IsString()
  slug: string;
}
