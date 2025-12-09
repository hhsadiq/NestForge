---
inject: true
to: src/<%= h.inflection.transform(parent, ['pluralize', 'underscore', 'dasherize']) %>/<%= h.inflection.transform(parent, ['pluralize', 'underscore', 'dasherize']) %>.service.ts
before: import
skip_if: <%= name %>Filters
---
<% if (functionalities.includes('findAllWithSearch')) { %>
import { <%= name %>Filters } from '../<%= h.inflection.transform(parent, ['pluralize', 'underscore', 'dasherize']) %>/types/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>.types';
<% } %>