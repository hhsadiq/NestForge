import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class EnableBiometricDto {
  @ApiProperty({
    type: String,
    example: 'device-id',
  })
  @IsString()
  deviceId: string;

  @ApiProperty({
    type: String,
    example: '1',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  biometricPublicKey: string;
}
