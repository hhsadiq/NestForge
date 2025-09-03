import { Injectable } from '@nestjs/common';
import * as Sentry from '@sentry/nestjs';
import { BIOMETRIC_CHALLENGE_EXPIRY } from 'test/utils/constants';

import { AuthService } from '@src/auth/auth.service';
import { EnableBiometricDto } from '@src/biometric-challenges/dtos/enable-biometric-payload.dto';
import { VerifyBiometricDto } from '@src/biometric-challenges/dtos/verify-biometric.dto';
import { BiometricChallengeAbstractRepository } from '@src/biometric-challenges/infrastructure/persistence/biometric-challenge.abstract.repository';
import {
  BIOMETRIC_CHALLENGE_ERROR,
  BIOMETRIC_VERIFICATION_FAILED,
  DISABLE_BIOMETRIC_ERROR,
  ENABLE_BIOMETRIC_ERROR,
  ERROR_BIOMETRIC_VERIFICATION,
} from '@src/common/error-messages';
import { BAD_REQUEST, NOT_FOUND } from '@src/common/exceptions';
import { User } from '@src/users/domain/user';
import { UsersService } from '@src/users/users.service';
import { verifySignature } from '@src/utils/crypto-helper';
import { generateUniqueSuffix } from '@src/utils/slugify';

@Injectable()
export class BiometricChallengeService {
  constructor(
    private readonly biometricRepo: BiometricChallengeAbstractRepository,
    private readonly authService: AuthService,
    private usersService: UsersService,
  ) {}

  async enable(
    userId: number | string,
    enableBiometricDto: EnableBiometricDto,
  ) {
    try {
      const userDevice = await this.usersService.findDeviceByUserIdAndDeviceId(
        userId,
        enableBiometricDto.deviceId,
      );
      if (!userDevice) {
        const userDevicePartial = {
          deviceId: enableBiometricDto.deviceId,
          user: { id: userId } as User,
        };
        await this.usersService.addBiometricKeyInUserDevice(
          userDevicePartial,
          enableBiometricDto,
        );
      } else {
        await this.usersService.addBiometricKeyInUserDevice(
          userDevice,
          enableBiometricDto,
        );
      }
      return;
    } catch (error) {
      throw BAD_REQUEST(
        ENABLE_BIOMETRIC_ERROR(userId, enableBiometricDto.deviceId),
        error,
      );
    }
  }

  async disable(userId: number | string, deviceId: string) {
    const userDevice = await this.usersService.findDeviceByUserIdAndDeviceId(
      userId,
      deviceId,
    );
    if (!userDevice) {
      throw NOT_FOUND('User device', { userId, deviceId });
    }
    try {
      await this.usersService.removeBiometricKeyInUserDevice(userDevice);
      return;
    } catch (error) {
      throw BAD_REQUEST(DISABLE_BIOMETRIC_ERROR(userId, deviceId), error);
    }
  }

  async getChallenge(deviceId: string, email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw NOT_FOUND('User', { email });
    }
    const userDevice = await this.usersService.findDeviceByUserIdAndDeviceId(
      user.id,
      deviceId,
    );
    if (!userDevice) {
      throw NOT_FOUND('User device', { userId: user.id, deviceId });
    }

    if (!userDevice.biometricPublicKey) {
      throw NOT_FOUND('Public key', { userId: user.id, deviceId });
    }

    const currentDate = new Date();
    currentDate.setMinutes(
      currentDate.getMinutes() +
        (BIOMETRIC_CHALLENGE_EXPIRY ? Number(BIOMETRIC_CHALLENGE_EXPIRY) : 5),
    );

    const payload = {
      challenge: generateUniqueSuffix(),
      expires_at: currentDate,
      user_device: { id: userDevice.id },
    };
    try {
      const challenge = await this.biometricRepo.getChallenge(payload);
      if (!challenge) {
        throw NOT_FOUND('Challenge', { userId: user.id, deviceId });
      }
      return challenge;
    } catch (error) {
      throw BAD_REQUEST(BIOMETRIC_CHALLENGE_ERROR(user.id, deviceId), error);
    }
  }

  async verify(verifyBiometricDto: VerifyBiometricDto) {
    const user = await this.usersService.findByEmail(verifyBiometricDto.email);
    if (!user) {
      throw NOT_FOUND('User', { email: verifyBiometricDto.email });
    }

    const userDevice = await this.usersService.findDeviceByUserIdAndDeviceId(
      user.id,
      verifyBiometricDto.deviceId,
    );
    if (!userDevice) {
      throw NOT_FOUND('User device', {
        userId: user.id,
        deviceId: verifyBiometricDto.deviceId,
      });
    }

    if (!userDevice.biometricPublicKey) {
      throw NOT_FOUND('Public key', {
        userId: user.id,
        deviceId: verifyBiometricDto.deviceId,
      });
    }

    try {
      const challenge = await this.biometricRepo.findChallenge(userDevice.id);
      if (!challenge || challenge == undefined) {
        throw NOT_FOUND('Challenge not found for', {
          deviceId: verifyBiometricDto.deviceId,
        });
      }

      const isVerified = verifySignature(
        userDevice.biometricPublicKey,
        challenge,
        verifyBiometricDto.challenge,
      );
      if (!isVerified) {
        Sentry.withScope((scope) => {
          scope.setExtra('publicKeyFromDB', userDevice?.biometricPublicKey);
          scope.setExtra('challengeFromDB', challenge);
          scope.setExtra(
            'encryptedChallengeFromPayload',
            verifyBiometricDto.challenge,
          );

          // Capture the main error message
          Sentry.captureMessage(BIOMETRIC_VERIFICATION_FAILED);
        });

        throw BAD_REQUEST(BIOMETRIC_VERIFICATION_FAILED);
      }
    } catch (e) {
      throw BAD_REQUEST(ERROR_BIOMETRIC_VERIFICATION, e);
    }

    const userToken = await this.authService.validateLoginWithBiometric(
      verifyBiometricDto.email,
    );
    return userToken;
  }
}
