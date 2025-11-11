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

  @ApiProperty({
    type: Date,
    description: 'Timestamp when the subject was created',
  })
  createdAt: Date;

  @ApiProperty({
    type: Date,
    description: 'Timestamp when the subject was last updated',
  })
  updatedAt: Date;
}
