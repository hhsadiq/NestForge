# Mapper Layer

Last verified: 2026-03-30

## Inject

Mappers bridge domain entities (camelCase) and DB entities (snake_case).
Always static methods, never instantiated.

**File location**: `infrastructure/persistence/relational/mappers/<entity>.mapper.ts`
**Class name**: `<Entity>Mapper` — exported named class, no `export default`.
**Two static methods only**: `toDomain(raw: EntityClass): DomainClass` and `toPersistence(domain: DomainClass): EntityClass`.

```typescript
// ✅ Correct mapper structure
export class BookingMapper {
  static toDomain(raw: BookingEntity): Booking {
    const domain = new Booking();
    domain.id = raw.id;
    domain.userId = raw.user_id;          // snake_case → camelCase
    domain.totalAmount = raw.total_amount;
    domain.createdAt = raw.created_at;
    return domain;
  }

  static toPersistence(domain: Booking): BookingEntity {
    const entity = new BookingEntity();
    if (domain.id) entity.id = domain.id;
    entity.user_id = domain.userId;        // camelCase → snake_case
    entity.total_amount = domain.totalAmount;
    entity.created_at = domain.createdAt;
    return entity;
  }
}
```

All camelCase ↔ snake_case translation happens HERE, not in services or controllers.
Mappers must not import from other mappers (to avoid coupling at the data layer).
Mappers must not import from services or controllers.

For query result shapes (`domain/queries/`), create a separate query mapper in
`relational/queries/<query-name>-query.mapper.ts` with the same static pattern.

Canonical examples:
- `src/bookings/infrastructure/persistence/relational/mappers/booking.mapper.ts`
- `src/bookings/infrastructure/persistence/relational/queries/property-review-query.mapper.ts`

## Reference

The mapper is the only place where the `snake_case` ↔ `camelCase` split is enforced.
This means the service layer receives all data in camelCase regardless of DB schema changes.

When a DB column is renamed, only the mapper needs to change — not the service, not the domain,
not the controller, not tests that mock the service. That is the entire value of this pattern.

`toPersistence()` is only needed for write operations (create, update). Read-only modules
can omit it, but including it makes the mapper complete.
