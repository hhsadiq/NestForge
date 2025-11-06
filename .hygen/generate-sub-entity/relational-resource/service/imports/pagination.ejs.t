---
inject: true
to: src/<%= h.inflection.transform(parent, ['pluralize', 'underscore', 'dasherize']) %>/<%= h.inflection.transform(parent, ['pluralize', 'underscore', 'dasherize']) %>.service.ts
after: import
skip_if: IPaginationOptions
---
<% if (functionalities.includes('findAll') || functionalities.includes('findAllWithSearch')) { %>
import { IPaginationOptions } from '../utils/types/pagination-options';
<% } %>