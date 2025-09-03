import { VerifyBiometricDto } from '@src/biometric-challenges/dtos/verify-biometric.dto';
import { BiometricChallengeEntity } from '@src/biometric-challenges/infrastructure/persistence/relational/entities/biometric-challenge.entity';
import { UserDevice } from '@src/users/domain/user-device';
import { NullableType } from '@src/utils/types/nullable.type';

export abstract class BiometricChallengeAbstractRepository {
  abstract getChallenge(payload): Promise<string | null | undefined>;

  abstract verify(
    verifyBiometricDto: VerifyBiometricDto,
  ): Promise<NullableType<BiometricChallengeEntity>>;

  abstract findChallenge(
    id: UserDevice['id'],
  ): Promise<string | null | undefined>;
}
