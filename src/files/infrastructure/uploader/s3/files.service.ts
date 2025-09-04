import { Injectable } from '@nestjs/common';

import { ERROR_MESSAGES } from '@src/common/error-messages';
import { UNPROCESSABLE_ENTITY } from '@src/common/exceptions';
import { File } from '@src/files/domain/file';
import { FileAbstractRepository } from '@src/files/infrastructure/persistence/file.abstract.repository';

@Injectable()
export class FilesS3Service {
  constructor(private readonly fileRepository: FileAbstractRepository) {}

  async create(file: Express.MulterS3.File): Promise<{ file: File }> {
    if (!file) {
      throw UNPROCESSABLE_ENTITY(ERROR_MESSAGES.NOT_PRESENT('file'), 'file');
    }

    return {
      file: await this.fileRepository.create({
        path: file.key,
      }),
    };
  }
}
