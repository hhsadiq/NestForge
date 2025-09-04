import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsDate, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateReviewDto {
  @ApiProperty({
    type: Number,
    example: 3,
    required: true,
  })
  @IsNumber()
  translationId: number;

  @ApiProperty({
    type: Number,
    example: 1,
    required: true,
  })
  @IsNumber()
  reviewerId: number;

  @ApiProperty({
    type: Number,
    example: 2,
    required: true,
  })
  @IsNumber()
  workflowStatusId: number;

  @ApiProperty({
    type: String,
    example: 'Needs more references.',
    required: false,
  })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiProperty({
    type: Date,
    example: '2023-06-23T18:32:09',
    required: false,
  })
  @Transform(({ value }) => new Date(value))
  @IsOptional()
  @IsDate()
  closedAt?: Date;
}
