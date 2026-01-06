---
to: src/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>/infrastructure/persistence/relational/entities/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.entity.ts
---
import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
   <% if (typeof fields !== 'undefined' && fields.length > 0) { %>
  Column,
  <% } %>
} from 'typeorm';
import { EntityRelationalHelper } from '@src/utils/relational-entity-helper';
import { TABLES } from '@src/common/constants';
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
import { <%= h.inflection.classify(enumName) %>Enum } from '@src/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>/enums/<%= h.inflection.transform(enumName, ['underscore', 'dasherize']) %>.enum';
<% }); %>
<% } %>

@Entity({
  name: TABLES.<%= h.inflection.camelize(name, true) %>,
})
export class <%= name %>Entity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('identity')
  id: number;

  <% if(typeof fields !== 'undefined' && fields.length > 0) { %>
  <% fields.forEach(field => {
    const propertyName = h.inflection.underscore(field.name, true);
    const columnName = h.inflection.underscore(field.name);
    // Map your types for TypeORM
    let columnType = '';
    let useTransformer = false;

    if (field.associatedEnumName) {
      columnType = 'varchar'; // Enums are stored as varchar in database
      useTransformer = true;
    } else if (field.type === 'varchar' || field.type === 'text' || field.type === 'uuid') {
      columnType = 'varchar';
    } else if (field.type === 'int') {
      columnType = 'int';
    } else if (field.type === 'float' || field.type === 'double' || field.type === 'numeric') {
      columnType = 'float';
    } else if (field.type === 'decimal') {
      columnType = 'decimal';
    } else if (field.type === 'boolean') {
      columnType = 'boolean';
    } else if (field.type === 'timestamp') {
      columnType = 'timestamp';
    } else if (field.type === 'date') {
      columnType = 'date';
    } else if (field.type === 'json') {
      columnType = 'jsonb';
    } else if (field.type === 'custom') {
      columnType = field.customType;
    } else if (field.type === 'time') {
      columnType = "time";
    } else {
      columnType = 'varchar'; // fallback
    }
  %>
  @Column({
    name: '<%= columnName %>',
    type: '<%= columnType %>',
    nullable: <%= field.optional %>,
    <% if (field.unique) { %>unique: true,<% } %>
  })
  <%= propertyName %><%= field.optional ? '?' : '' %>: <%- field.associatedEnumName ? h.inflection.classify(field.associatedEnumName) + 'Enum' : field.type === 'int' || field.type === 'float' || field.type === 'double' || field.type === 'decimal' || field.type === 'numeric' ? 'number' : field.type === 'boolean' ? 'boolean' : field.type === 'json' ? 'Record<string, any>' : field.type === 'timestamp' ? 'Date' : field.type === 'date' ? 'Date' : 'string' %>;
  <% }) %>
  <% } %>
  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
