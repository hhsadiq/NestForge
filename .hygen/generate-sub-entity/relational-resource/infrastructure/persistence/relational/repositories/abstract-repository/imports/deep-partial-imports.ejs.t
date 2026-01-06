---
inject: true
to: src/<%= h.inflection.transform(parent, ['pluralize', 'underscore', 'dasherize']) %>/infrastructure/persistence/<%= h.inflection.transform(parent, ['underscore', 'dasherize']) %>.abstract.repository.ts
prepend: true
skip_if: "{ DeepPartial }"
---
<% if (functionalities.includes('update')) { %>
import { DeepPartial } from '../../../utils/types/deep-partial.type';
<% } %>
