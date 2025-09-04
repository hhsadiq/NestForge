// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';

import { CreateParagraphDto } from './create-paragraph.dto';

export class UpdateParagraphDto extends PartialType(CreateParagraphDto) {}
