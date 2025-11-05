---
to: "<%= functionalities.includes('findAll') ? `src/${h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize'])}/types/${h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize'])}.types.ts` : null %>"
---
// TODO: Add <%= name %> filters types based on the query i.e. name
export type <%= name %>Filters = {
  
};
