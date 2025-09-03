import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BiometricChallengeAbstractRepository } from '@src/biometric-challenges/infrastructure/persistence/biometric-challenge.abstract.repository';
import { BiometricChallengeEntity } from '@src/biometric-challenges/infrastructure/persistence/relational/entities/biometric-challenge.entity';
import { BiometricChallengeRelationalRepository } from '@src/biometric-challenges/infrastructure/persistence/relational/repositories/biometric-challenge.repository';

@Module({
  imports: [TypeOrmModule.forFeature([BiometricChallengeEntity])],
  providers: [
    {
      provide: BiometricChallengeAbstractRepository,
      useClass: BiometricChallengeRelationalRepository,
    },
  ],
  exports: [BiometricChallengeAbstractRepository],
})
export class RelationalBiometricChallengePersistenceModule {}
