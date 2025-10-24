# Idempotency Module

## Table of Contents <!-- omit in toc -->

- [Overview](#overview)
  - [Key Features](#key-features)
- [Configuration](#configuration)
- [Usage](#usage)
  - [Basic Implementation](#basic-implementation)
  - [Required Headers](#required-headers)
- [References](#references)

## Overview

The Idempotency Module provides request deduplication functionality to ensure that duplicate requests are handled safely. It uses cache-based storage to track request states and prevent duplicate processing.

### Key Features

- **Request Deduplication**: Prevents duplicate processing of identical requests
- **Flag Control**: Environment-based enable/disable functionality
- **Cache-Based Storage**: Uses Redis cache for request state management
- **UUID Validation**: Ensures idempotency keys are valid UUIDs

## Configuration

Add to your `.env` file:

```bash
# Enable/disable idempotency feature (default: false)
IDEMPOTENCY_ENABLED=true
```

## Usage

### Basic Implementation

```typescript
import { Controller, Post, UseInterceptors } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { IdempotencyInterceptor } from '@src/idempotencies/idemptencies.interceptor';

@Controller('api')
export class ApiController {
  @Post('create')
  @UseInterceptors(IdempotencyInterceptor)
  @ApiOkResponse({
    description: 'Resource created successfully',
  })
  async createResource(@Body() createDto: CreateDto) {
    // Your business logic here
    return { id: 'resource_123', status: 'created' };
  }
}
```

### Required Headers

Clients must include the `x-idempotency-key` header with a valid UUID:

```bash
curl -X POST /api/create \
  -H "x-idempotency-key: 550e8400-e29b-41d4-a716-446655440000" \
  -H "Content-Type: application/json" \
  -d '{"name": "example", "value": 100}'
```

## References

- [NestJS Interceptors Documentation](https://docs.nestjs.com/interceptors)
- [Idempotency Best Practices](https://stripe.com/docs/api/idempotent_requests)
- [Architecture Guide](architecture.md)

---

Previous: [Scheduler](scheduler.md)

Next: [Benchmarking](benchmarking.md)
