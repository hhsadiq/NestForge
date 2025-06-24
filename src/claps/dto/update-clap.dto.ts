// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';

import { CreateClapDto } from './create-clap.dto';

export class UpdateClapDto extends PartialType(CreateClapDto) {}
