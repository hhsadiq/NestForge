---
inject: true
to: src/<%= h.inflection.transform(parent, ['pluralize', 'underscore', 'dasherize']) %>/infrastructure/persistence/relational/repositories/<%= h.inflection.transform(parent, ['underscore', 'dasherize']) %>.repository.ts
before: "import"
skip_if: "NullableType"
---

<% if (functionalities.includes('findOne')) { %>
import { NullableType } from '@src/utils/types/nullable.type';
<% } %>
