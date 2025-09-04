import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

import {} from 'class-transformer';

export class CreateMeterDto {
  @ApiProperty({
    type: String,
    example: 'Beher-e-ramal',
    required: true,
  })
  @IsString()
  name: string;

  @ApiProperty({
    type: String,
    example: 'ramal',
    required: true,
  })
  @IsString()
  slug: string;

  @ApiProperty({
    type: String,
    example: 'A traditional poetic meter.',
    required: false,
  })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiProperty({
    type: Number,
    example: 1,
    required: true,
  })
  @IsNumber()
  fileId: number;
}
