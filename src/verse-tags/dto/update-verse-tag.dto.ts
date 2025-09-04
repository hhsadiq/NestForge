// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';

import { CreateVerseTagDto } from './create-verse-tag.dto';

export class UpdateVerseTagDto extends PartialType(CreateVerseTagDto) {}
