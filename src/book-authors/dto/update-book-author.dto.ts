// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';

import { CreateBookAuthorDto } from './create-book-author.dto';

export class UpdateBookAuthorDto extends PartialType(CreateBookAuthorDto) {}
