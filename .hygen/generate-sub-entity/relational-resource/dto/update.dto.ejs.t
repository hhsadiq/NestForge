---
to: "<%= functionalities.includes('update') ? `src/${h.inflection.transform(parent, ['pluralize', 'underscore', 'dasherize'])}/dto/update-${h.inflection.transform(name, ['underscore', 'dasherize'])}.dto.ts` : null %>"
---
// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';
import { Create<%= name %>Dto } from './create-<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.dto';

export class Update<%= name %>Dto extends PartialType(Create<%= name %>Dto) {}
