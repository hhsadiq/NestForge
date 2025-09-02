---
inject: true
to: "<%= version === 'v1' ? 'src/' + h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) + '/domain/' + h.inflection.transform(name, ['underscore', 'dasherize']) + '.ts' : 'src/' + h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) + '/' + version + '/domain/' + h.inflection.transform(name, ['underscore', 'dasherize']) + '.' + version + '.ts' %>"
after: "export class"
---

@ApiProperty({
  type: <%= h.getPropertyType(type) %>,
  example: "<%= example %>",
})
<%= h.inflection.camelize(property, true) %><% if (isOptional) { -%>?<% } -%>: <%= h.getType(type) %>;