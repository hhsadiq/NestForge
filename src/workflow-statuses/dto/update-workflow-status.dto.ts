// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';

import { CreateWorkflowStatusDto } from './create-workflow-status.dto';

export class UpdateWorkflowStatusDto extends PartialType(
  CreateWorkflowStatusDto,
) {}
