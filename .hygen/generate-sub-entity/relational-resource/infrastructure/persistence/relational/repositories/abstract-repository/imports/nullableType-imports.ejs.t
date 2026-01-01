---
inject: true
to: src/<%= h.inflection.transform(parent, ['pluralize', 'underscore', 'dasherize']) %>/infrastructure/persistence/<%= h.inflection.transform(parent, ['underscore', 'dasherize']) %>.abstract.repository.ts
prepend: true
skip_if: "{ NullableType }"
---

<% if (functionalities.includes('findOne')) { %>
import { NullableType } from '@src/utils/types/nullable.type';
<% } %>
