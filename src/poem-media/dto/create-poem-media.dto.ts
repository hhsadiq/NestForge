import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

import {} from 'class-transformer';

export class CreatePoemMediaDto {
  @ApiProperty({
    type: Number,
    example: 1,
    required: true,
  })
  @IsNumber()
  poemId: number;

  @ApiProperty({
    type: Number,
    example: 1,
    required: true,
  })
  @IsNumber()
  mediaPlatformId: number;

  @ApiProperty({
    type: String,
    example: 'https://youtube.com/watch?v=xyz123',
    required: true,
  })
  @IsString()
  link: string;

  @ApiProperty({
    type: String,
    example: 'Live performance recording.',
    required: false,
  })
  @IsOptional()
  @IsString()
  note?: string;
}
