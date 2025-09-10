---
to: "<%= functionalities.includes('create') ? `src/${h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize'])}/dto/create-${h.inflection.transform(name, ['underscore', 'dasherize'])}.dto.ts` : null %>"
---
<%
  const hasDtoFields = fields?.some(f => f.includeInDTO);

  const needsString = fields?.some(f => f.includeInDTO && ['varchar','text','uuid','custom'].includes(f.type) && f.customType !== 'bit(1)');
  const needsNumber = fields?.some(f => f.includeInDTO && ['int','float','double','decimal'].includes(f.type));
  const needsBoolean = fields?.some(f => f.includeInDTO && (f.type === 'boolean' || (f.type === 'custom' && f.customType === 'bit(1)')));
  const needsDate = fields?.some(f => f.includeInDTO && ['timestamp','date'].includes(f.type));
  const needsObject = fields?.some(f => f.includeInDTO && f.type === 'json');
  const needsOptional = fields?.some(f => f.includeInDTO && f.optional);
  const needsEnum = fields?.some(f => f.includeInDTO && f.associatedEnumName);
  
  const enumImports = new Set();
  if (fields) {
    fields.filter(f => f.includeInDTO).forEach(field => {
      if (field.associatedEnumName) {
        enumImports.add(field.associatedEnumName);
      }
    });
  }
%>

<% if (hasDtoFields) { %>
import { ApiProperty } from '@nestjs/swagger';

import {
<% if (needsString) { %>  IsString,<% } %>
<% if (needsNumber) { %>  IsNumber,<% } %>
<% if (needsBoolean) { %>  IsBoolean,<% } %>
<% if (needsDate) { %>  IsDate,<% } %>
<% if (needsObject) { %>  IsObject,<% } %>
<% if (needsOptional) { %>  IsOptional,<% } %>
<% if (needsEnum) { %>  IsEnum,<% } %>
} from 'class-validator';

<% if (enumImports.size > 0) { %>
<% enumImports.forEach(enumName => { %>
import { <%= h.inflection.classify(enumName) %>Enum } from '../enums/<%= h.inflection.transform(enumName, ['underscore', 'dasherize']) %>.enum';
<% }); %>
<% } %>

<% if (needsDate) { %>
import { Transform } from 'class-transformer';
<% } %>
<% } %>

export class Create<%= name %>Dto {
  <% if(typeof fields !== 'undefined' && fields.length > 0) { %>
  <% fields.filter(field => field.includeInDTO).forEach(field => { 
    const propertyName = h.inflection.camelize(field.name, true);

    // Handle enum fields
    if (field.associatedEnumName) {
  %>
  @ApiProperty({
    enum: <%= h.inflection.classify(field.associatedEnumName) %>Enum,
    required: <%= !field.optional %>
  })
  <% if (field.optional) { %>@IsOptional()<% } %>
  @IsEnum(<%= h.inflection.classify(field.associatedEnumName) %>Enum)
  <%= propertyName %><%= field.optional ? '?' : '' %>: <%= h.inflection.classify(field.associatedEnumName) %>Enum;
  <% } else {
    const tsType = (
      field.type === 'varchar' || field.type === 'text' || field.type === 'uuid' || field.type === 'custom'
        ? (field.customType === 'bit(1)' ? 'boolean' : 'string')
        : field.type === 'int' || field.type === 'float' || field.type === 'double' || field.type === 'decimal'
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
      tsType === 'string' ? 'String' :
      tsType === 'number' ? 'Number' :
      tsType === 'boolean' ? 'Boolean' :
      tsType === 'Date' ? 'Date' :
      'Object'
    );
  %>
  @ApiProperty({
    type: <%= apiType %>,
    example: <%- JSON.stringify(field.example) %>,
    required: <%= !field.optional %>
  })
  <% if (tsType === 'Date') { %>@Transform(({ value }) => new Date(value))<% } %>
  <% if (field.optional) { %>@IsOptional()<% } %>
  <% if (tsType === 'string') { %>@IsString()<% } %>
  <% if (tsType === 'number') { %>@IsNumber()<% } %>
  <% if (tsType === 'boolean') { %>@IsBoolean()<% } %>
  <% if (tsType === 'Date') { %>@IsDate()<% } %>
  <% if (tsType === 'Record<string, any>') { %>@IsObject()<% } %>
  <%= propertyName %><%= field.optional ? '?' : '' %>: <%- tsType %>;
  <% } %>
  <% }) %>
  <% } %>
}
