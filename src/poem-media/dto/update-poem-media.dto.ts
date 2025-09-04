// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';

import { CreatePoemMediaDto } from './create-poem-media.dto';

export class UpdatePoemMediaDto extends PartialType(CreatePoemMediaDto) {}
