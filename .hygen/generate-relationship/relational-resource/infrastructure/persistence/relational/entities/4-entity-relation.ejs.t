---
inject: true
# Step 1: Inject into the entity file of the parent
to: "<%= sourceEntityParent 
        ? `src/${h.inflection.transform(sourceEntityParent, ['pluralize', 'underscore', 'dasherize'])}/infrastructure/persistence/relational/entities/${h.inflection.transform(sourceEntityName, ['underscore', 'dasherize'])}.entity.ts`
        : `src/${h.inflection.transform(sourceEntityName, ['pluralize', 'underscore', 'dasherize'])}/infrastructure/persistence/relational/entities/${h.inflection.transform(sourceEntityName, ['underscore', 'dasherize'])}.entity.ts` %>"
after: "export class"
---

<% if (relationType === 'OneToOne') { -%>
@OneToOne(() => <%= h.inflection.classify(relationEntityName) %>Entity)
@JoinColumn({ name: '<%= sourceColumnName %>' })
<%= fieldName %>: <%= h.inflection.classify(relationEntityName) %>Entity;
<% } else if (relationType === 'ManyToOne') { -%>
@ManyToOne(() => <%= h.inflection.classify(relationEntityName) %>Entity)
@JoinColumn({ name: '<%= sourceColumnName %>' })
<%= fieldName %>: <%= h.inflection.classify(relationEntityName) %>Entity;
<% } else if (relationType === 'OneToMany') { -%>
@OneToMany(() => <%= h.inflection.classify(relationEntityName) %>Entity, (x) => x.<%= relationFieldName %>)
<%= h.inflection.pluralize(fieldName) %>: <%= h.inflection.classify(relationEntityName) %>Entity[];
<% } %>
