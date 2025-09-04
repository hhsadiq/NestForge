// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';

import { CreatePoemDto } from './create-poem.dto';

export class UpdatePoemDto extends PartialType(CreatePoemDto) {}
