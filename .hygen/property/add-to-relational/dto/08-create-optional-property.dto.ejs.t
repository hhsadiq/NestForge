---
inject: true
to: "<%= version === 'v1' ? 'src/' + h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) + '/dto/create-' + h.inflection.transform(name, ['underscore', 'dasherize']) + '.dto.ts' : 'src/' + h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) + '/' + version + '/dto/create-' + h.inflection.transform(name, ['underscore', 'dasherize']) + '.dto.' + version + '.ts' %>"
before: "} from 'class-validator'"
skip_if: \IsOptional,
---
<% if (isOptional) { -%>
IsOptional,
<% } -%>