# HTTP Module

## Table of Contents <!-- omit in toc -->

- [Overview](#overview)
  - [Key Features](#key-features)
- [Architecture](#architecture)
- [Configuration](#configuration)
  - [Environment Variables](#environment-variables)
- [Usage Examples](#usage-examples)
  - [Basic HTTP Requests](#basic-http-requests)
  - [Request with Logging](#request-with-logging)

## Overview

The HTTP module provides a configured Axios-based HTTP client with integrated logging capabilities. It extends NestJS's built-in `@nestjs/axios` module with automatic request/response logging, error tracking, and correlation ID management.

### Key Features

- **Automatic Logging** - All HTTP requests and responses are logged with correlation IDs
- **Error Tracking** - Comprehensive error logging with status codes and response data
- **Request Timeout** - Configurable timeout settings
- **Redirect Handling** - Configurable maximum redirect limits
- **Correlation ID Propagation** - Automatic correlation ID inclusion in requests
- **User Context** - User ID tracking for audit trails

## Architecture

The HTTP module is built on top of NestJS's Axios integration with custom logging:

```
src/http/
├── custom-http.module.ts        # Module definition with Axios configuration
├── logging-http.service.ts      # HTTP service with integrated logging
└── config/
    ├── http.config.ts           # Configuration factory
    └── http-config.type.ts      # TypeScript types
```

## Configuration

The HTTP module is configured through environment variables and automatically integrates with the logging system.

### Environment Variables

```bash
# HTTP Request Configuration
HTTP_REQ_TIMEOUT=5000          # Request timeout in milliseconds (default: 5)
HTTP_MAX_REDIRECTS=100000      # Maximum redirects (default: 100000)
```




## Usage Examples

### Basic HTTP Requests

```typescript
import { LoggingHttpService } from '@src/http/logging-http.service';

@Injectable()
export class ExternalApiService {
  constructor(private readonly httpService: LoggingHttpService) {}



  async createUser(userData: CreateUserDto): Promise<User> {
    const response = await this.httpService.request({
      method: 'POST',
      url: 'https://api.external-service.com/users',
      data: userData,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer your-token',
      },
      serviceName: 'ExternalUserService',
    }).toPromise();

    return response.data;
  }
}
```

### Request with Logging

All requests automatically include logging. The system logs:

1. **Request Start:**
   ```json
   {
     "level": "info",
     "message": "ExternalUserService API call started",
     "serviceName": "ExternalUserService",
     "method": "POST",
     "url": "https://api.external-service.com/users",
     "payload": {"name": "John Doe", "email": "john@example.com"},
     "headers": {"Content-Type": "application/json"},
     "correlationId": "550e8400-e29b-41d4-a716-446655440000",
     "userId": 123,
     "type": "third_party_call_start"
   }
   ```

2. **Request Success:**
   ```json
   {
     "level": "info",
     "message": "ExternalUserService API call completed",
     "serviceName": "ExternalUserService",
     "method": "POST",
     "url": "https://api.external-service.com/users",
     "status": 201,
     "durationMs": 245,
     "response": {"id": 1, "name": "John Doe", "email": "john@example.com"},
     "correlationId": "550e8400-e29b-41d4-a716-446655440000",
     "userId": 123,
     "type": "third_party_call_end"
   }
   ```

3. **Request Error:**
   ```json
   {
     "level": "error",
     "message": "ExternalUserService API call failed",
     "serviceName": "ExternalUserService",
     "method": "POST",
     "url": "https://api.external-service.com/users",
     "status": 400,
     "durationMs": 120,
     "error": {
       "message": "Validation failed",
       "response": {"error": "Email is required"},
       "status": 400
     },
     "correlationId": "550e8400-e29b-41d4-a716-446655440000",
     "userId": 123,
     "type": "third_party_call_end"
   }
   ```

---

Previous: [Logging](logging.md)

Next: [Testing](tests.md)
