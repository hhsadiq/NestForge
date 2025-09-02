---
inject: true
to: "<%= sourceEntityParent 
        ? `src/${h.inflection.transform(sourceEntityParent, ['pluralize', 'underscore', 'dasherize'])}/infrastructure/persistence/relational/entities/${h.inflection.transform(sourceEntityName, ['underscore', 'dasherize'])}.entity.ts`
        : `src/${h.inflection.transform(sourceEntityName, ['pluralize', 'underscore', 'dasherize'])}/infrastructure/persistence/relational/entities/${h.inflection.transform(sourceEntityName, ['underscore', 'dasherize'])}.entity.ts` %>"
after: from 'typeorm'
skip_if: "<%= sourceEntityName === relationEntityName 
  ? `export class ${h.inflection.classify(relationEntityName)}Entity` 
  : `import { ${h.inflection.classify(relationEntityName)}Entity }` %>"
---

import { <%= h.inflection.classify(relationEntityName) %>Entity } from '@src/<%= relationEntityParent 
        ? `${h.inflection.transform(relationEntityParent, ['pluralize', 'underscore', 'dasherize'])}` 
        : `${h.inflection.transform(relationEntityName, ['pluralize', 'underscore', 'dasherize'])}` %>/infrastructure/persistence/relational/entities/<%= h.inflection.transform(relationEntityName, ['underscore', 'dasherize']) %>.entity';
