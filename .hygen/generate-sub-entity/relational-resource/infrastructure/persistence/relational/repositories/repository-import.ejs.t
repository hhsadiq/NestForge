---
inject: true
to: src/<%= h.inflection.transform(parent, ['pluralize', 'underscore', 'dasherize']) %>/infrastructure/persistence/relational/repositories/<%= h.inflection.transform(parent, ['underscore', 'dasherize']) %>.repository.ts
after: import
---
import { <%= name %>Entity } from '../entities/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.entity';
