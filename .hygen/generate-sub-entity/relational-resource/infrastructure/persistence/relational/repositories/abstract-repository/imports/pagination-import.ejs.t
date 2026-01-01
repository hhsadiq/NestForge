---
inject: true
to: src/<%= h.inflection.transform(parent, ['pluralize', 'underscore', 'dasherize']) %>/infrastructure/persistence/<%= h.inflection.transform(parent, ['underscore', 'dasherize']) %>.abstract.repository.ts
prepend: true
skip_if: "{ IPaginationOptions }"
---

<% if (functionalities.includes('findAll') || functionalities.includes('findAllWithSearch')) { %>
import { IPaginationOptions } from '../../../utils/types/pagination-options';
<% } %>
