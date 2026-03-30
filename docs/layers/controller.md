# Controller Layer

Last verified: 2026-03-30

## Inject

Controllers are the HTTP layer. They delegate all logic to the service — zero business logic here.

**Required decorators** on every controller class:
```typescript
@ApiTags('ResourceName')     // Swagger grouping — match the URL path name, Title Case
@ApiBearerAuth()             // All routes require JWT unless explicitly public
@UseGuards(AuthGuard('jwt')) // JWT guard on the class
@Controller({ path: 'resource-name', version: '1' })
export class ResourceController {
  constructor(private readonly resourceService: ResourceService) {}
}
```

**Pagination defaults** on list endpoints (standardized across all modules):
```typescript
const page = query?.page ?? 1;
let limit = query?.limit ?? 10;
if (limit > 50) limit = 50;
```

**Two response shapes** depending on endpoint type:
```typescript
// infinityPagination — standard list (no total count needed)
@ApiOkResponse({ type: InfinityPaginationResponse(Booking) })
async findAll(...): Promise<InfinityPaginationResponseDto<Booking>> {
  return infinityPagination(await this.service.findAllWithPagination(...), { page, limit });
}

// PaginationResponse — when total count is needed (raw query endpoints)
@ApiOkResponse({ type: PaginationResponse(PropertyReviewQuery) })
async findReviews(...): Promise<PaginationResponseDto<PropertyReviewQuery>> {
  return this.service.findPropertyReviewsWithPagination(...);
}
```

**ID params** require `@ApiParam`:
```typescript
@Get(':id')
@ApiParam({ name: 'id', type: Number, required: true })
findOne(@Param('id') id: number) { return this.service.findOne(id); }
```

No direct imports from infrastructure, mappers, or DB entities. Import only service, domain
types (for response type annotations), and DTOs.

Canonical example: `src/bookings/bookings.controller.ts`

## Reference

Controllers are intentionally thin. The only logic allowed here is:
- Parsing query params with defaults (`page ?? 1`, `limit ?? 10`)
- Capping limits (`if (limit > 50) limit = 50`)
- Computing derived filter inputs (e.g. date math from enum in `FindPropertyBookingAggregatedDto`)
- Wrapping service results in the correct pagination DTO

If you find yourself writing conditional business logic in a controller, it belongs in the service.
