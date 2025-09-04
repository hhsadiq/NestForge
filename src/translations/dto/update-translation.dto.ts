// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';

import { CreateTranslationDto } from './create-translation.dto';

export class UpdateTranslationDto extends PartialType(CreateTranslationDto) {}
