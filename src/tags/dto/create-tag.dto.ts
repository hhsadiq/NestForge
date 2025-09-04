import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

import {} from 'class-transformer';

export class CreateTagDto {
  @ApiProperty({
    type: String,
    example: 'Love',
    required: true,
  })
  @IsString()
  name: string;

  @ApiProperty({
    type: String,
    example: 'love',
    required: true,
  })
  @IsString()
  slug: string;

  @ApiProperty({
    type: String,
    example: 'Romantic poetry',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}
