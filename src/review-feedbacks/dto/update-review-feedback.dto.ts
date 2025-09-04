// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';

import { CreateReviewFeedbackDto } from './create-review-feedback.dto';

export class UpdateReviewFeedbackDto extends PartialType(
  CreateReviewFeedbackDto,
) {}
