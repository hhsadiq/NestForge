---
inject: true
to: src/app.module.ts
after: import
---
import { <%= h.inflection.transform(name, ['pluralize']) %>Module } from './<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>.module';
