// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';

import { CreateParagraphTagDto } from './create-paragraph-tag.dto';

export class UpdateParagraphTagDto extends PartialType(CreateParagraphTagDto) {}
