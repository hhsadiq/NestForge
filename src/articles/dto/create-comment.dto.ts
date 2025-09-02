import {
  // decorators here
  ApiProperty,
} from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty()
  @IsString()
  body: string;

  // @custom-inject-point

  // Don't forget to use the class-validator decorators in the DTO properties.
}
