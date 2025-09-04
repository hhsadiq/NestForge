// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';

import { CreatePoemTagDto } from './create-poem-tag.dto';

export class UpdatePoemTagDto extends PartialType(CreatePoemTagDto) {}
