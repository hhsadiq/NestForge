import { ApiProperty } from '@nestjs/swagger';

export class Subject {
  @ApiProperty({
    type: Number,
    description: 'Unique identifier for the subject',
  })
  id: number;

  @ApiProperty({
    type: String,
    description: 'Unique name of the subject',
    example: 'User',
  })
  name: string;
}
