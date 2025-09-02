---
inject: true
to: src/<%= h.inflection.transform(parent, ['pluralize', 'underscore', 'dasherize']) %>/infrastructure/persistence/<%= h.inflection.transform(parent, ['underscore', 'dasherize']) %>.abstract.repository.ts
before: 'import'
---

<% if (functionalities.includes('update') || functionalities.includes('create') || functionalities.includes('findOne') || functionalities.includes('findAll') || functionalities.includes('delete')) { %>
import { <%= name %> } from '../../domain/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>';
<% } %>
