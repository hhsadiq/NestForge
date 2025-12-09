---
inject: true
to: "<%= version === 'v1' ? `src/${h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize'])}/infrastructure/persistence/relational/entities/${h.inflection.transform(name, ['underscore', 'dasherize'])}.entity.ts` : `src/${h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize'])}/${version}/infrastructure/persistence/relational/entities/${h.inflection.transform(name, ['underscore', 'dasherize'])}.entity.${version}.ts` %>"
after: "export class"
---

@Column({ 
  type: '<%= type %>'<% if (isOptional) { -%>, nullable: true<% } -%><% if (unique) { -%>, unique: true<% } -%>
})
<%= property %><% if (isOptional) { -%>?<% } -%>: <%= h.getType(type) %>;
