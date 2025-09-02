---
inject: true
to: src/common/constants.ts
after: export const TABLES = 
---
  <%= h.inflection.camelize(name, true) %>: '<%= h.inflection.transform(name, ['underscore']) %>',