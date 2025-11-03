import { ApiProperty } from '@nestjs/swagger';

export class Role {
  @ApiProperty({
    type: Number,
    description: 'Unique identifier for the role',
  })
  id: number;

  @ApiProperty({
    type: String,
    description: 'Name of the role (e.g., Admin, User)',
    example: 'User',
  })
  name: string;

  @ApiProperty({
    type: String,
    description: 'Description of what the role allows',
    nullable: true,
    example: 'Allows reading data',
  })
  description?: string;
}
