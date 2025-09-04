import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

import {} from 'class-transformer';

export class CreateAuthorDto {
  @ApiProperty({
    type: String,
    example: 'John Doe',
    required: true,
  })
  @IsString()
  displayName: string;

  @ApiProperty({
    type: String,
    example: 'Doe, John',
    required: false,
  })
  @IsOptional()
  @IsString()
  sortName?: string;

  @ApiProperty({
    type: String,
    example: 'A noted contemporary author.',
    required: false,
  })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({
    type: String,
    example: 'john-doe',
    required: true,
  })
  @IsString()
  slug: string;

  @ApiProperty({
    type: String,
    example: 'john@example.com',
    required: false,
  })
  @IsOptional()
  @IsString()
  email?: string;
}
