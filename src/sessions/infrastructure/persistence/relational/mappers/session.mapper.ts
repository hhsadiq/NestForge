import { Session } from '@src/sessions/domain/session';
import { SessionEntity } from '@src/sessions/infrastructure/persistence/relational/entities/session.entity';
import { UserEntity } from '@src/users/infrastructure/persistence/relational/entities/user.entity';
import { UserMapper } from '@src/users/infrastructure/persistence/relational/mappers/user.mapper';

export class SessionMapper {
  static toDomain(raw: SessionEntity): Session {
    const domainEntity = new Session();
    domainEntity.id = raw.id;
    if (raw.user) {
      domainEntity.user = UserMapper.toDomain(raw.user);
    }
    domainEntity.hash = raw.hash;
    domainEntity.createdAt = raw.created_at;
    domainEntity.updatedAt = raw.updated_at;
    domainEntity.deletedAt = raw.deleted_at;
    return domainEntity;
  }

  static toPersistence(domainEntity: Session): SessionEntity {
    const user = new UserEntity();
    user.id = Number(domainEntity.user.id);

    const persistenceEntity = new SessionEntity();
    if (domainEntity.id && typeof domainEntity.id === 'number') {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.hash = domainEntity.hash;
    persistenceEntity.user = user;
    persistenceEntity.created_at = domainEntity.createdAt;
    persistenceEntity.updated_at = domainEntity.updatedAt;
    persistenceEntity.deleted_at = domainEntity.deletedAt;

    return persistenceEntity;
  }
}
