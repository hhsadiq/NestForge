# DTO Layer

Last verified: 2026-03-30

## Inject

DTOs define request/response shapes. They live in `src/<module>/dto/`.

**Naming convention**:
- `find-all-<entities>.dto.ts` → `FindAll<Entities>Dto`
- `create-<entity>.dto.ts` → `Create<Entity>Dto`
- `update-<entity>.dto.ts` → `Update<Entity>Dto`
- `find-<specific-query>.dto.ts` → `Find<SpecificQuery>Dto`

**FindAll DTOs always extend the shared pagination DTO**:
```typescript
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class FindAllBookingsDto {
  @ApiPropertyOptional() @IsOptional() @IsNumber() @Type(() => Number)
  page?: number;

  @ApiPropertyOptional() @IsOptional() @IsNumber() @Type(() => Number)
  limit?: number;
}
```

**Enums in DTOs**: define enums in `src/<module>/enums/<name>.enum.ts`, import into DTOs.
Never inline enum definitions inside DTO files.

**@ApiPropertyOptional / @ApiProperty**: all DTO properties must have Swagger decorators.
**@IsOptional / @IsNotEmpty**: every property must have explicit validation.

DTOs use camelCase properties (same as domain and service layer).
DTOs must not import from `infrastructure/` or domain entities — they are independent shapes.

Canonical examples:
- `src/bookings/dto/find-all-bookings.dto.ts`
- `src/bookings/dto/find-property-booking-aggregated.dto.ts`

## Reference

DTOs define what comes in (from HTTP) and what goes out (to HTTP client). They are not domain
entities — do not reuse domain entities as DTO types in controller return types.

For response shapes, use the domain entity class directly with Swagger decorators on that class
(add `@ApiProperty()` on domain entity properties as needed for Swagger docs). Do not create
separate response DTOs unless the shape differs materially from the domain entity.
