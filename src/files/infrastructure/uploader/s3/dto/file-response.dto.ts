import { ApiProperty } from '@nestjs/swagger';

import { File } from '@src/files/domain/file';

export class FileResponseDto {
  @ApiProperty({
    type: () => File,
  })
  file: File;
}
