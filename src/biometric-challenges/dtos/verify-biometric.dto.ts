import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class VerifyBiometricDto {
  @ApiProperty({
    type: String,
  })
  @IsString()
  challenge: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  deviceId: string;

  @ApiProperty({
    type: String,
    example: 'abc@test.com',
  })
  @IsString()
  email: string;
}
