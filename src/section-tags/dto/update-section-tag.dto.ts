// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';

import { CreateSectionTagDto } from './create-section-tag.dto';

export class UpdateSectionTagDto extends PartialType(CreateSectionTagDto) {}
