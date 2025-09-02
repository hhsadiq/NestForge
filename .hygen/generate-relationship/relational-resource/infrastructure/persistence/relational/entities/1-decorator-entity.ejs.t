---
inject: true
to: "<%= sourceEntityParent 
        ? `src/${h.inflection.transform(sourceEntityParent, ['pluralize', 'underscore', 'dasherize'])}/infrastructure/persistence/relational/entities/${h.inflection.transform(sourceEntityName, ['underscore', 'dasherize'])}.entity.ts`
        : `src/${h.inflection.transform(sourceEntityName, ['pluralize', 'underscore', 'dasherize'])}/infrastructure/persistence/relational/entities/${h.inflection.transform(sourceEntityName, ['underscore', 'dasherize'])}.entity.ts` %>"
before: "from 'typeorm';"
skip_if: "JoinColumn"
---

<% if (relationType === 'OneToOne' || relationType === 'ManyToOne') { -%>
JoinColumn,
<% } %>
