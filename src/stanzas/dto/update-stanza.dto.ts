// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';

import { CreateStanzaDto } from './create-stanza.dto';

export class UpdateStanzaDto extends PartialType(CreateStanzaDto) {}
