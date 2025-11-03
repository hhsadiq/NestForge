import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

import { PermissionActionEnum } from '@src/access-management/enums/permission-actions.enum';

export class CreatePermissionDto {
  @ApiProperty({ enum: PermissionActionEnum })
  @IsEnum(PermissionActionEnum)
  action: PermissionActionEnum;

  @ApiProperty({ example: 'User' })
  @IsString()
  subject: string;

  @ApiProperty({ example: 'Allows updating users', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}
