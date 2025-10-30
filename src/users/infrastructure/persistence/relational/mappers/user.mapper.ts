import { FileEntity } from '@src/files/infrastructure/persistence/relational/entities/file.entity';
import { FileMapper } from '@src/files/infrastructure/persistence/relational/mappers/file.mapper';
import { StatusEntity } from '@src/statuses/infrastructure/persistence/relational/entities/status.entity';
import { User } from '@src/users/domain/user';
import { UserEntity } from '@src/users/infrastructure/persistence/relational/entities/user.entity';

export class UserMapper {
  static toDomain(raw: UserEntity): User {
    const domainEntity = new User();
    domainEntity.username = raw.username;

    domainEntity.id = raw.id;
    domainEntity.email = raw.email;
    domainEntity.password = raw.password;
    domainEntity.previousPassword = raw.previous_password;
    domainEntity.provider = raw.provider;
    domainEntity.socialId = raw.social_id;
    domainEntity.firstName = raw.first_name;
    domainEntity.lastName = raw.last_name;
    if (raw.photo) {
      domainEntity.photo = FileMapper.toDomain(raw.photo);
    }

    domainEntity.status = raw.status;
    domainEntity.createdAt = raw.created_at;
    domainEntity.updatedAt = raw.updated_at;
    domainEntity.deletedAt = raw.deleted_at;
    return domainEntity;
  }

  static toPersistence(domainEntity: User): UserEntity {
    let photo: FileEntity | undefined | null = undefined;

    if (domainEntity.photo) {
      photo = new FileEntity();
      photo.id = domainEntity.photo.id;
      photo.path = domainEntity.photo.path;
    } else if (domainEntity.photo === null) {
      photo = null;
    }

    let status: StatusEntity | undefined = undefined;

    if (domainEntity.status) {
      status = new StatusEntity();
      status.id = Number(domainEntity.status.id);
    }

    const persistenceEntity = new UserEntity();
    persistenceEntity.username = domainEntity.username;

    if (domainEntity.id && typeof domainEntity.id === 'number') {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.email = domainEntity.email;
    persistenceEntity.password = domainEntity.password;
    persistenceEntity.previous_password = domainEntity.previousPassword;
    persistenceEntity.provider = domainEntity.provider;
    persistenceEntity.social_id = domainEntity.socialId;
    persistenceEntity.first_name = domainEntity.firstName;
    persistenceEntity.last_name = domainEntity.lastName;
    persistenceEntity.photo = photo;
    persistenceEntity.status = status;
    persistenceEntity.created_at = domainEntity.createdAt;
    persistenceEntity.updated_at = domainEntity.updatedAt;
    persistenceEntity.deleted_at = domainEntity.deletedAt;
    return persistenceEntity;
  }
}
