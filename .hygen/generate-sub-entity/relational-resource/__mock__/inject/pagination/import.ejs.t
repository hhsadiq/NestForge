---
inject: true
to: "<%= isAddTestCase ? `src/${h.inflection.transform(parent, ['pluralize', 'underscore', 'dasherize'])}/__mock__/${h.inflection.transform(parent, ['underscore', 'dasherize'])}.mock.ts` : null %>"
after: import
skip_if: IPaginationOptions
---
<% if (functionalities.includes('findAll') || functionalities.includes('findAllWithSearch')) { %>
import { IPaginationOptions } from '../utils/types/pagination-options';
<% } %>