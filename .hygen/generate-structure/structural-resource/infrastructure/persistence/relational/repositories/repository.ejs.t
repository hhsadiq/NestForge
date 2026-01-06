---
to: src/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>/infrastructure/persistence/relational/repositories/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.repository.ts
---
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


import { <%= name %>AbstractRepository } from '../../<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.abstract.repository';
@Injectable()
export class <%= name %>RelationalRepository implements <%= name %>AbstractRepository {
  constructor(
  ) {}
}
