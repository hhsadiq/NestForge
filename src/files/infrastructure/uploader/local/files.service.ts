import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ERROR_MESSAGES } from '@src/common/error-messages';
import { UNPROCESSABLE_ENTITY } from '@src/common/exceptions';
import { AllConfigType } from '@src/config/config.type';
import { File } from '@src/files/domain/file';
import { FileAbstractRepository } from '@src/files/infrastructure/persistence/file.abstract.repository';

@Injectable()
export class FilesLocalService {
  constructor(
    private readonly configService: ConfigService<AllConfigType>,
    private readonly fileRepository: FileAbstractRepository,
  ) {}

  async create(file: Express.Multer.File): Promise<{ file: File }> {
    if (!file) {
      throw UNPROCESSABLE_ENTITY(ERROR_MESSAGES.NOT_PRESENT('file'), 'file');
    }

    return {
      file: await this.fileRepository.create({
        path: `/${this.configService.get('app.apiPrefix', {
          infer: true,
        })}/v1/${file.path}`,
      }),
    };
  }
}
