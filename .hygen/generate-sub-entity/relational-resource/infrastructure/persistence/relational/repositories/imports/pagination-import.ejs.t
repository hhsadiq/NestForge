---
inject: true
to: src/<%= h.inflection.transform(parent, ['pluralize', 'underscore', 'dasherize']) %>/infrastructure/persistence/relational/repositories/<%= h.inflection.transform(parent, ['underscore', 'dasherize']) %>.repository.ts
before: "import"
skip_if: "IPaginationOptions"
---

<% if (functionalities.includes('findAll') || functionalities.includes('findAllWithSearch')) { %>
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
<% } %>