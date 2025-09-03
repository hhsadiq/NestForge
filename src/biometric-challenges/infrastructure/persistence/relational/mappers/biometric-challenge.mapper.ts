import { BiometricChallenge } from '@src/biometric-challenges/domain/biometric-challenge';
import { BiometricChallengeEntity } from '@src/biometric-challenges/infrastructure/persistence/relational/entities/biometric-challenge.entity';
import { UserDeviceMapper } from '@src/users/infrastructure/persistence/relational/mappers/user-device.mapper';

export class BiometricChallengeMapper {
  static toDomain(raw: BiometricChallengeEntity): BiometricChallenge {
    const domainEntity = new BiometricChallenge();
    domainEntity.id = raw.id;
    domainEntity.challenge = raw.challenge;

    if (raw.user_device) {
      domainEntity.userDevice = UserDeviceMapper.toDomain(raw.user_device);
    }

    domainEntity.createdAt = raw.created_at;
    domainEntity.updatedAt = raw.updated_at;
    domainEntity.expiresAt = raw.expires_at;
    return domainEntity;
  }

  static toPersistence(
    domainEntity: BiometricChallenge,
  ): BiometricChallengeEntity {
    const persistenceEntity = new BiometricChallengeEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.challenge = domainEntity.challenge;

    if (domainEntity.userDevice) {
      persistenceEntity.user_device = UserDeviceMapper.toPersistence(
        domainEntity.userDevice,
      );
    }

    persistenceEntity.created_at = domainEntity.createdAt;
    persistenceEntity.updated_at = domainEntity.updatedAt;
    persistenceEntity.expires_at = domainEntity.expiresAt;
    return persistenceEntity;
  }
}
