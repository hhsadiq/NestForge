import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

import {} from 'class-transformer';

export class CreateWorkflowStatusDto {
  @ApiProperty({
    type: String,
    example: 'pending',
    required: true,
  })
  @IsString()
  code: string;

  @ApiProperty({
    type: String,
    example: 'Pending',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    type: String,
    example: 'Awaiting approval',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}
