// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';

import { CreateVerseAuthorDto } from './create-verse-author.dto';

export class UpdateVerseAuthorDto extends PartialType(CreateVerseAuthorDto) {}
