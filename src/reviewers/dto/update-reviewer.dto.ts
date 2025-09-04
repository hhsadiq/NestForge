// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';

import { CreateReviewerDto } from './create-reviewer.dto';

export class UpdateReviewerDto extends PartialType(CreateReviewerDto) {}
