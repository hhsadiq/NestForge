---
inject: true
to: src/<%= h.inflection.transform(parent, ['pluralize', 'underscore', 'dasherize']) %>/infrastructure/persistence/relational/relational-persistence.module.ts
after: import
---
import { <%= name %>Entity } from './entities/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.entity';
