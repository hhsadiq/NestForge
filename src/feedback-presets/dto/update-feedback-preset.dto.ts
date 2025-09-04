// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';

import { CreateFeedbackPresetDto } from './create-feedback-preset.dto';

export class UpdateFeedbackPresetDto extends PartialType(
  CreateFeedbackPresetDto,
) {}
