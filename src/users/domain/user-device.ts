import { ApiProperty } from '@nestjs/swagger';

import { User } from '@src/users/domain/user';

export class UserDevice {
  @ApiProperty({
    type: Number,
  })
  id: number;

  @ApiProperty({
    type: String,
  })
  deviceId: string;

  @ApiProperty({
    type: () => User,
  })
  user: User;

  @ApiProperty({
    type: String,
  })
  biometricPublicKey: string;

  @ApiProperty()
  deletedAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  createdAt: Date;
}
