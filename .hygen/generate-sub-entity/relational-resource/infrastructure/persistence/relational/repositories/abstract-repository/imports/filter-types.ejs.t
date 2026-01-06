---
inject: true
to: src/<%= h.inflection.transform(parent, ['pluralize', 'underscore', 'dasherize']) %>/infrastructure/persistence/<%= h.inflection.transform(parent, ['underscore', 'dasherize']) %>.abstract.repository.ts
prepend: true
skip_if: '{ <%= name %>Filters }'
---

<% if (functionalities.includes('findAllWithSearch')) { %>
import { <%= name %>Filters } from '../../../<%= h.inflection.transform(parent, ['pluralize', 'underscore', 'dasherize']) %>/types/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>.types';
<% } %>
