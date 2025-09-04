// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';

import { CreatePoemFormDto } from './create-poem-form.dto';

export class UpdatePoemFormDto extends PartialType(CreatePoemFormDto) {}
