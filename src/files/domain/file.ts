import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { Allow } from 'class-validator';

import { transformFilePath } from '@src/files/transform-file-path.utils';

export class File {
  @ApiProperty({
    type: Number,
    example: 1,
  })
  @Allow()
  id: number;

  @ApiProperty({
    type: String,
    example: 'https://example.com/path/to/file.jpg',
  })
  @Transform(transformFilePath, { toPlainOnly: true })
  path: string;
}
