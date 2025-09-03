import { Module } from '@nestjs/common';

import { AuthModule } from '@src/auth/auth.module';
import { BiometricChallengeController } from '@src/biometric-challenges/biometric-challenges.controller';
import { BiometricChallengeService } from '@src/biometric-challenges/biometric-challenges.service';
import { RelationalBiometricChallengePersistenceModule } from '@src/biometric-challenges/infrastructure/persistence/relational/relational-persistence.module';
import { UsersModule } from '@src/users/users.module';

@Module({
  imports: [
    RelationalBiometricChallengePersistenceModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [BiometricChallengeController],
  providers: [BiometricChallengeService],
  exports: [BiometricChallengeService],
})
export class BiometricChallengeModule {}
