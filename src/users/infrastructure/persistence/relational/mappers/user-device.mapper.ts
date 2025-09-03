import { UserDevice } from '@src/users/domain/user-device';
import { UserDeviceEntity } from '@src/users/infrastructure/persistence/relational/entities/user-device.entity';
import { UserMapper } from '@src/users/infrastructure/persistence/relational/mappers/user.mapper';

export class UserDeviceMapper {
  static toDomain(raw: UserDeviceEntity): UserDevice {
    const domainEntity = new UserDevice();
    domainEntity.id = raw.id;
    domainEntity.deviceId = raw.device_id;
    domainEntity.biometricPublicKey = raw.biometric_public_key;

    if (raw.user) {
      domainEntity.user = UserMapper.toDomain(raw.user);
    }

    domainEntity.createdAt = raw.created_at;
    domainEntity.updatedAt = raw.updated_at;
    domainEntity.deletedAt = raw.deleted_at;
    return domainEntity;
  }

  static toPersistence(domainEntity: UserDevice): UserDeviceEntity {
    const persistenceEntity = new UserDeviceEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.device_id = domainEntity.deviceId;
    persistenceEntity.biometric_public_key = domainEntity.biometricPublicKey;

    if (domainEntity.user) {
      persistenceEntity.user = UserMapper.toPersistence(domainEntity.user);
    }

    persistenceEntity.created_at = domainEntity.createdAt;
    persistenceEntity.updated_at = domainEntity.updatedAt;
    persistenceEntity.deleted_at = domainEntity.deletedAt;
    return persistenceEntity;
  }
}
