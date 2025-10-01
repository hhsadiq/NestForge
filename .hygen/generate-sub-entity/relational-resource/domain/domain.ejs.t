---
to: src/<%= h.inflection.transform(parent, ['pluralize', 'underscore', 'dasherize']) %>/domain/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.ts
---
import { ApiProperty } from '@nestjs/swagger';
<%
  // Collect all unique enums needed for imports
  const enumImports = new Set();
  if (fields) {
    fields.forEach(field => {
      if (field.associatedEnumName) {
        enumImports.add(field.associatedEnumName);
      }
    });
  }
%>
<% if (enumImports.size > 0) { %>
<% enumImports.forEach(enumName => { %>
import { <%= h.inflection.classify(enumName) %>Enum } from '../enums/<%= h.inflection.transform(enumName, ['underscore', 'dasherize']) %>.enum';
<% }); %>
<% } %>

export class <%= name %> {
  @ApiProperty({
    type: Number,
  })
  id: number;

  <% if (typeof fields !== 'undefined' && fields.length > 0) { %>
    <% fields.forEach(field => { 
      const tsType = (
        field.associatedEnumName
          ? h.inflection.classify(field.associatedEnumName) + 'Enum'
          : field.type === 'varchar' || field.type === 'text' || field.type === 'uuid' || field.type === 'custom'
          ? 'string'
          : field.type === 'int' || field.type === 'float' || field.type === 'double' || field.type === 'decimal' || feild.type === 'numeric'
          ? 'number'
          : field.type === 'boolean'
          ? 'boolean'
          : field.type === 'timestamp' || field.type === 'date'
          ? 'Date'
          : field.type === 'json'
          ? 'Record<string, any>'
          : 'any'
      );

      const apiType = (
        field.associatedEnumName
          ? field.associatedEnumName + 'Enum'
          : tsType === 'string' ? 'String' :
          tsType === 'number' ? 'Number' :
          tsType === 'boolean' ? 'Boolean' :
          tsType === 'Date' ? 'Date' :
          tsType === 'Record<string, any>' ? 'Object' : 'any'
      );

      const propertyName = h.inflection.camelize(field.name, true);

      let exampleValue = field.example;
      if (field.type === 'json') {
        try {
          exampleValue = JSON.parse(field.example);
        } catch {}
      }
    %>
     @ApiProperty({
      <% if (field.associatedEnumName) { %>
        enum: <%= apiType %>,
      <% } else { %>
        type: <%= apiType %>,
        example: <%- JSON.stringify(exampleValue, null, 2) %>,
        required: <%= !field.optional %>,
      <% } %>
    })
    <%= propertyName %><%= field.optional ? '?' : '' %>: <%- tsType %>;
    <% }) %>
  <% } %>
  @ApiProperty({
    type: Date,
  })
  createdAt: Date;

  @ApiProperty({
    type: Date,
  })
  updatedAt: Date;
}