import { ApiProperty } from '@nestjs/swagger';

export class Tag {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty()
  name: string;

  // @custom-inject-point
  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
