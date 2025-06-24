import { ApiProperty } from '@nestjs/swagger';

export class Clap {
  @ApiProperty({
    type: String,
    example: '811fe16b-984b-49a4-b52d-b1ebde52a6ed',
  })
  articleId: string;

  @ApiProperty({
    type: Number,
    example: '1',
  })
  userId: number;

  @ApiProperty({
    type: String,
  })
  id: string;

  // @custom-inject-point
  @ApiProperty({
    type: Date,
  })
  createdAt: Date;

  @ApiProperty({
    type: Date,
  })
  updatedAt: Date;
}
