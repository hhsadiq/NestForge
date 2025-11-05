---
inject: true
to: src/<%= h.inflection.transform(parent, ['pluralize', 'underscore', 'dasherize']) %>/infrastructure/persistence/relational/repositories/<%= h.inflection.transform(parent, ['underscore', 'dasherize']) %>.repository.ts
before: "import"
skip_if: <%= name %>Filters
---

<% if (functionalities.includes('findAll')) { %>
import { <%= name %>Filters } from '../../../../../<%= h.inflection.transform(parent, ['pluralize', 'underscore', 'dasherize']) %>/types/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>.types';
<% } %>