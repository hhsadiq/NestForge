import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GetChallengePathParamDto {
  @ApiProperty()
  @IsString()
  deviceId: string;

  @ApiProperty({
    type: String,
    example: 'abc@test.com',
  })
  @IsString()
  email: string;
}
