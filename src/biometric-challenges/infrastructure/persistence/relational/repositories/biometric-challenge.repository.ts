import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, MoreThan, Not, Repository } from 'typeorm';

import { VerifyBiometricDto } from '@src/biometric-challenges/dtos/verify-biometric.dto';
import { BiometricChallengeAbstractRepository } from '@src/biometric-challenges/infrastructure/persistence/biometric-challenge.abstract.repository';
import { BiometricChallengeEntity } from '@src/biometric-challenges/infrastructure/persistence/relational/entities/biometric-challenge.entity';
import { UserDevice } from '@src/users/domain/user-device';
import { NullableType } from '@src/utils/types/nullable.type';

@Injectable()
export class BiometricChallengeRelationalRepository
  implements BiometricChallengeAbstractRepository
{
  constructor(
    @InjectRepository(BiometricChallengeEntity)
    private readonly biometricChallengeRepository: Repository<BiometricChallengeEntity>,
  ) {}

  async getChallenge(
    payload: BiometricChallengeEntity,
  ): Promise<string | null | undefined> {
    const currentDate = new Date();
    try {
      const biometricChallenge =
        await this.biometricChallengeRepository.findOne({
          where: {
            user_device: { id: payload.user_device.id },
            expires_at: MoreThan(currentDate),
            challenge: Not(IsNull()),
          },
        });

      if (biometricChallenge) return biometricChallenge.challenge;

      const newBiometricChallenge =
        await this.biometricChallengeRepository.save(
          this.biometricChallengeRepository.create(payload),
        );

      return newBiometricChallenge ? newBiometricChallenge.challenge : null;
    } catch (error) {
      throw error;
    }
  }

  async findChallenge(
    id: UserDevice['id'],
  ): Promise<string | null | undefined> {
    const currentDate = new Date();
    try {
      const biometricChallenge =
        await this.biometricChallengeRepository.findOne({
          where: {
            user_device: { id },
            expires_at: MoreThan(currentDate),
          },
        });

      return biometricChallenge ? biometricChallenge.challenge : null;
    } catch (error) {
      throw error;
    }
  }

  async verify(
    verifyBiometricDto: VerifyBiometricDto,
  ): Promise<NullableType<BiometricChallengeEntity>> {
    const currentDate = new Date();
    try {
      const entityChallenge = await this.biometricChallengeRepository.findOne({
        where: {
          user_device: { device_id: verifyBiometricDto.deviceId },
          expires_at: MoreThan(currentDate),
          challenge: verifyBiometricDto.challenge,
        },
      });
      return entityChallenge;
    } catch (error) {
      throw error;
    }
  }
}
