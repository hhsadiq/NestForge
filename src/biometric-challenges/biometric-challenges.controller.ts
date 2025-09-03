import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Delete,
  Patch,
  Param,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { LoginResponseDto } from '@src/auth/dto/login-response.dto';
import { BiometricChallengeService } from '@src/biometric-challenges/biometric-challenges.service';
import { DisableBiometricDto } from '@src/biometric-challenges/dtos/disable-biometric-payload.dto';
import { EnableBiometricDto } from '@src/biometric-challenges/dtos/enable-biometric-payload.dto';
import { GetChallengePathParamDto } from '@src/biometric-challenges/dtos/get-challenge-params.dto';
import { VerifyBiometricDto } from '@src/biometric-challenges/dtos/verify-biometric.dto';

@ApiTags('Biometric Challenge')
@Controller({
  path: 'biometric-challenge',
  version: '1',
})
export class BiometricChallengeController {
  constructor(private readonly service: BiometricChallengeService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch('enable')
  @ApiOkResponse()
  enable(@Body() enableBiometricDto: EnableBiometricDto) {
    return this.service.enable(enableBiometricDto.userId, enableBiometricDto);
  }

  @ApiBearerAuth()
  @Delete('disable/:userId/:deviceId')
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse()
  disable(@Param() params: DisableBiometricDto) {
    const { deviceId, userId } = params;
    return this.service.disable(userId, deviceId);
  }

  @Get('getChallenge/:deviceId/:email')
  @ApiOkResponse()
  getChallenge(@Param() params: GetChallengePathParamDto) {
    const { deviceId, email } = params;
    return this.service.getChallenge(deviceId, email);
  }

  @Post('verify')
  @ApiOkResponse({
    type: LoginResponseDto,
  })
  @HttpCode(HttpStatus.CREATED)
  verify(@Body() verifyBiometricDto: VerifyBiometricDto) {
    return this.service.verify(verifyBiometricDto);
  }
}
