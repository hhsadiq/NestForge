import {
  // decorators here
  ApiProperty,
} from '@nestjs/swagger';
import {
  // decorators here

  IsNumber,
  IsString,
} from 'class-validator';

export class CreateClapDto {
  @ApiProperty({
    type: String,
    example: '811fe16b-984b-49a4-b52d-b1ebde52a6ed',
  })
  @IsString()
  articleId: string;

  @ApiProperty({
    type: Number,
    example: '1',
  })
  @IsNumber()
  userId: number;

  // @custom-inject-point
  // Don't forget to use the class-validator decorators in the DTO properties.
}
