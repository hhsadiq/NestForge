import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

import {} from 'class-transformer';

export class CreatePoemFormDto {
  @ApiProperty({
    type: String,
    example: 'Ghazal',
    required: true,
  })
  @IsString()
  name: string;

  @ApiProperty({
    type: String,
    example: 'ghazal',
    required: true,
  })
  @IsString()
  slug: string;

  @ApiProperty({
    type: String,
    example: 'A rhyming form of poetry.',
    required: false,
  })
  @IsOptional()
  @IsString()
  note?: string;
}
