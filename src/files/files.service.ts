import { Injectable } from '@nestjs/common';

import { NullableType } from '@src/utils/types/nullable.type';

import { File } from './domain/file';
import { FileAbstractRepository } from './infrastructure/persistence/file.abstract.repository';

@Injectable()
export class FilesService {
  constructor(private readonly fileRepository: FileAbstractRepository) {}

  findById(id: File['id']): Promise<NullableType<File>> {
    return this.fileRepository.findById(id);
  }
}
