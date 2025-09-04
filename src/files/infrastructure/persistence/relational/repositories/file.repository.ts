import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { File } from '@src/files/domain/file';
import { FileAbstractRepository } from '@src/files/infrastructure/persistence/file.abstract.repository';
import { FileEntity } from '@src/files/infrastructure/persistence/relational/entities/file.entity';
import { FileMapper } from '@src/files/infrastructure/persistence/relational/mappers/file.mapper';
import { NullableType } from '@src/utils/types/nullable.type';

@Injectable()
export class FileRelationalRepository implements FileAbstractRepository {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
  ) {}

  async create(data: File): Promise<File> {
    const persistenceModel = FileMapper.toPersistence(data);
    return this.fileRepository.save(
      this.fileRepository.create(persistenceModel),
    );
  }

  async findById(id: File['id']): Promise<NullableType<File>> {
    const entity = await this.fileRepository.findOne({
      where: {
        id: id,
      },
    });

    return entity ? FileMapper.toDomain(entity) : null;
  }
}
