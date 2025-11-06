---
to: "<%= functionalities.includes('findAll') || functionalities.includes('findAllWithSearch') ? `src/${h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize'])}/dto/find-all-${h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize'])}.dto.ts` : null %>"
---
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class FindAll<%= h.inflection.transform(name, ['pluralize']) %>Dto {
  @ApiPropertyOptional({
    type:Number,
    example:1
  })
  @Transform(({ value }) => (value ? Number(value) : 1))
  @IsNumber()
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({
    type:Number,
    example:10
  })
  @Transform(({ value }) => (value ? Number(value) : 10))
  @IsNumber()
  @IsOptional()
  limit?: number;

  <% if (functionalities.includes('findAllWithSearch')) { %>
  // You can add filters here based on the query i.e. query?.name
  <% } %>
}
