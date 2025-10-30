import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

import { PermissionAction } from '@src/access-management/infrastructure/persistence/relational/entities/permission.entity';

export class CreatePermissionDto {
  @ApiProperty({ enum: PermissionAction })
  @IsEnum(PermissionAction)
  action: PermissionAction;

  @ApiProperty({ example: 'User' })
  @IsString()
  subject: string;

  @ApiProperty({ example: 'Allows updating users', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}
