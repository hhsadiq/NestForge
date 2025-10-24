# HTTP Module

## Table of Contents <!-- omit in toc -->

- [Overview](#overview)
- [Architecture](#architecture)
- [Configuration](#configuration)
- [Core Components](#core-components)
  - [CustomHttpModule](#customhttpmodule)
  - [LoggingHttpService](#logginghttpservice)
  - [HTTP Configuration](#http-configuration)
- [Usage Examples](#usage-examples)
  - [Basic HTTP Requests](#basic-http-requests)
  - [Request with Logging](#request-with-logging)
  - [Error Handling](#error-handling)
  - [Custom Headers](#custom-headers)
- [Integration with Logging](#integration-with-logging)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

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

### Module Registration

The HTTP module is automatically registered in the application:

```typescript
// In app.module.ts
@Module({
  imports: [
    CustomHttpModule, // Provides configured HTTP client
    // ... other modules
  ],
})
export class AppModule {}
```

## Core Components

### CustomHttpModule

The main module that configures Axios with timeout and redirect settings.

```typescript
@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        timeout: configService.get<number>('http.reqTimeout'),
        maxRedirects: configService.get<number>('http.maxRedirects'),
      }),
    }),
    LoggingsModule,
  ],
  providers: [LoggingHttpService],
  exports: [HttpModule, LoggingHttpService],
})
export class CustomHttpModule {}
```

### LoggingHttpService

A wrapper around the standard Axios HTTP service that adds automatic logging.

```typescript
@Injectable()
export class LoggingHttpService {
  constructor(
    private readonly httpService: HttpService,
    private readonly loggingsService: LoggingsService,
    private readonly requestContextService: RequestContextService,
  ) {}

  request<T>(
    config: AxiosRequestConfig & { serviceName?: string }
  ): Observable<AxiosResponse<T>>
}
```

**Features:**
- Automatic request start logging
- Response completion logging with duration
- Error logging with detailed error information
- Correlation ID and user ID propagation
- Service name categorization for better log organization

### HTTP Configuration

Type-safe configuration with validation:

```typescript
export type HttpConfig = {
  reqTimeout?: number;    // Request timeout in milliseconds
  maxRedirects?: number;  // Maximum number of redirects
};
```

## Usage Examples

### Basic HTTP Requests

```typescript
import { LoggingHttpService } from '@src/http/logging-http.service';

@Injectable()
export class ExternalApiService {
  constructor(private readonly httpService: LoggingHttpService) {}

  async getUsers(): Promise<User[]> {
    const response = await this.httpService.request({
      method: 'GET',
      url: 'https://api.external-service.com/users',
      serviceName: 'ExternalUserService', // Optional: for log categorization
    }).toPromise();

    return response.data;
  }

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

### Error Handling

The service automatically handles and logs errors:

```typescript
@Injectable()
export class PaymentService {
  constructor(private readonly httpService: LoggingHttpService) {}

  async processPayment(paymentData: PaymentDto): Promise<PaymentResult> {
    try {
      const response = await this.httpService.request({
        method: 'POST',
        url: 'https://api.payment-provider.com/charges',
        data: paymentData,
        serviceName: 'PaymentProvider',
      }).toPromise();

      return response.data;
    } catch (error) {
      // Error is automatically logged by LoggingHttpService
      // You can add additional error handling here
      if (error.response?.status === 402) {
        throw new PaymentFailedException('Payment was declined');
      }
      throw error;
    }
  }
}
```

### Custom Headers

Add custom headers for authentication and other requirements:

```typescript
@Injectable()
export class AuthenticatedApiService {
  constructor(private readonly httpService: LoggingHttpService) {}

  async getProtectedData(token: string): Promise<any> {
    return this.httpService.request({
      method: 'GET',
      url: 'https://api.protected-service.com/data',
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-API-Version': 'v2',
        'X-Client-ID': 'my-app',
      },
      serviceName: 'ProtectedService',
    }).toPromise();
  }
}
```

### Query Parameters

Handle query parameters properly:

```typescript
@Injectable()
export class SearchService {
  constructor(private readonly httpService: LoggingHttpService) {}

  async searchUsers(query: string, page: number = 1): Promise<SearchResult> {
    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
      limit: '10',
    });

    const response = await this.httpService.request({
      method: 'GET',
      url: `https://api.search-service.com/users?${params}`,
      serviceName: 'SearchService',
    }).toPromise();

    return response.data;
  }
}
```

## Integration with Logging

The HTTP module is tightly integrated with the logging system:

### Automatic Features

1. **Correlation ID Propagation** - All requests include the current correlation ID
2. **User Context** - User ID is automatically included in logs
3. **Request Timing** - Duration is calculated and logged
4. **Error Tracking** - Comprehensive error information is captured
5. **Service Categorization** - Use `serviceName` to group related API calls

### Log Analysis

Use CloudWatch Insights to analyze HTTP requests:

```sql
-- Find all failed API calls
fields @timestamp, serviceName, method, url, status, error
| filter type = "third_party_call_end" and status >= 400
| sort @timestamp desc
| limit 100

-- Track API performance by service
fields @timestamp, serviceName, durationMs, status
| filter type = "third_party_call_end"
| stats avg(durationMs), max(durationMs), count() by serviceName
| sort avg(durationMs) desc

-- Find slow API calls
fields @timestamp, serviceName, method, url, durationMs
| filter type = "third_party_call_end" and durationMs > 5000
| sort durationMs desc
| limit 50
```

## Best Practices

### 1. Use Descriptive Service Names

```typescript
// ✅ Good - Clear service identification
this.httpService.request({
  url: 'https://api.payment-provider.com/charges',
  serviceName: 'StripePaymentService',
});

// ❌ Avoid - Generic names
this.httpService.request({
  url: 'https://api.payment-provider.com/charges',
  serviceName: 'API',
});
```

### 2. Handle Timeouts Appropriately

```typescript
// For quick operations
this.httpService.request({
  url: 'https://api.quick-service.com/data',
  timeout: 2000, // 2 seconds
  serviceName: 'QuickService',
});

// For long-running operations
this.httpService.request({
  url: 'https://api.slow-service.com/process',
  timeout: 30000, // 30 seconds
  serviceName: 'SlowService',
});
```

### 3. Use Proper Error Handling

```typescript
// ✅ Good - Specific error handling
try {
  const response = await this.httpService.request(config).toPromise();
  return response.data;
} catch (error) {
  if (error.response?.status === 404) {
    throw new NotFoundException('Resource not found');
  }
  if (error.response?.status === 401) {
    throw new UnauthorizedException('Invalid credentials');
  }
  throw new InternalServerErrorException('External service error');
}

// ❌ Avoid - Generic error handling
try {
  const response = await this.httpService.request(config).toPromise();
  return response.data;
} catch (error) {
  throw new Error('Something went wrong');
}
```

### 4. Include Relevant Headers

```typescript
// ✅ Good - Include necessary headers
this.httpService.request({
  url: 'https://api.service.com/endpoint',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'User-Agent': 'MyApp/1.0',
    'X-Request-ID': generateRequestId(),
  },
  serviceName: 'ExternalService',
});
```

### 5. Use Retry Logic for Transient Failures

```typescript
import { retry, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

async callWithRetry(config: AxiosRequestConfig, maxRetries: number = 3) {
  return this.httpService.request(config).pipe(
    retry({
      count: maxRetries,
      delay: (error, retryCount) => {
        // Exponential backoff
        return timer(Math.pow(2, retryCount) * 1000);
      },
    }),
    catchError(error => {
      this.logger.error(`API call failed after ${maxRetries} retries`, error);
      return throwError(() => error);
    })
  ).toPromise();
}
```

## Troubleshooting

### Common Issues

#### 1. Request Timeouts

**Symptoms:** Requests fail with timeout errors

**Solutions:**
- Increase `HTTP_REQ_TIMEOUT` environment variable
- Set custom timeout for specific requests
- Check network connectivity and external service status

```typescript
// Custom timeout for specific request
this.httpService.request({
  url: 'https://api.slow-service.com/data',
  timeout: 30000, // 30 seconds
  serviceName: 'SlowService',
});
```

#### 2. Missing Correlation IDs

**Symptoms:** Logs don't show correlation IDs

**Solutions:**
- Ensure `RequestContextService` is properly configured
- Check that `CorrelationIdMiddleware` is registered
- Verify the request is made within a request context

#### 3. Authentication Failures

**Symptoms:** 401/403 errors from external APIs

**Solutions:**
- Verify authentication tokens are valid
- Check token expiration
- Ensure proper header formatting

```typescript
// Debug authentication issues
this.logger.debug('Making authenticated request', {
  url: config.url,
  headers: config.headers,
  serviceName: config.serviceName,
});
```

#### 4. Rate Limiting

**Symptoms:** 429 errors from external APIs

**Solutions:**
- Implement exponential backoff
- Add request queuing
- Contact API provider for rate limit increases

```typescript
// Rate limiting handling
if (error.response?.status === 429) {
  const retryAfter = error.response.headers['retry-after'];
  await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
  // Retry the request
}
```

### Debug Mode

Enable debug logging for HTTP requests:

```typescript
// In your service
this.logger.debug('Making HTTP request', {
  url: config.url,
  method: config.method,
  headers: config.headers,
  serviceName: config.serviceName,
});
```

### Monitoring

Set up CloudWatch alarms for HTTP errors:

```yaml
# CloudWatch Alarm for high error rate
ErrorRateAlarm:
  Type: AWS::CloudWatch::Alarm
  Properties:
    MetricName: ErrorCount
    Namespace: MyApp/HTTP
    Statistic: Sum
    Period: 300
    EvaluationPeriods: 2
    Threshold: 10
    ComparisonOperator: GreaterThanThreshold
```

---

Previous: [Logging](logging.md)

Next: [Testing](tests.md)
