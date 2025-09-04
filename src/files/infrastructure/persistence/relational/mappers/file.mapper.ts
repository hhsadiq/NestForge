import { File } from '@src/files/domain/file';
import { FileEntity } from '@src/files/infrastructure/persistence/relational/entities/file.entity';

export class FileMapper {
  static toDomain(raw: FileEntity): File {
    const domainEntity = new File();
    domainEntity.id = raw.id;
    domainEntity.path = raw.path;
    return domainEntity;
  }

  static toPersistence(domainEntity: File): FileEntity {
    const persistenceEntity = new FileEntity();
    persistenceEntity.id = domainEntity.id;
    persistenceEntity.path = domainEntity.path;
    return persistenceEntity;
  }
}
