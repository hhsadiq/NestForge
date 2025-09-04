import { ApiProperty } from '@nestjs/swagger';

export class SectionTag {
  @ApiProperty({
    type: Number,
  })
  id: number;

  @ApiProperty({
    type: Number,
    example: 1,
    required: true,
  })
  sectionId: number;

  @ApiProperty({
    type: Number,
    example: 1,
    required: true,
  })
  tagId: number;

  @ApiProperty({
    type: Date,
  })
  createdAt: Date;

  @ApiProperty({
    type: Date,
  })
  updatedAt: Date;
}
