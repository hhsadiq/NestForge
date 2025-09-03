import { ApiProperty } from '@nestjs/swagger';

import { UserDevice } from '@src/users/domain/user-device';

export class BiometricChallenge {
  @ApiProperty({
    type: Number,
  })
  id: number;

  @ApiProperty({
    type: () => UserDevice,
  })
  userDevice: UserDevice;

  @ApiProperty({
    type: String,
  })
  challenge: string;

  @ApiProperty()
  expiresAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  createdAt: Date;
}
