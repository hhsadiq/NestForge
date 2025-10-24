# Logging System

## Table of Contents <!-- omit in toc -->

- [Overview](#overview)
  - [Key Features](#key-features)
- [Architecture](#architecture)
- [Configuration](#configuration)
  - [Environment Variables](#environment-variables)
- [Core Components](#core-components)
  - [LoggingsService](#loggingsservice)
  - [Logger Utils](#logger-utils)
  - [Request Context](#request-context)
  - [Correlation ID Middleware](#correlation-id-middleware)
- [Usage Examples](#usage-examples)
  - [Basic Logging](#basic-logging)
  - [HTTP Request/Response Logging](#http-requestresponse-logging)
  - [Third-Party API Logging](#third-party-api-logging)
  - [SDK Call Logging](#sdk-call-logging)
- [Environment Configuration](#environment-configuration)
  - [Local Development](#local-development)
  - [Production Environment](#production-environment)
- [Best Practices](#best-practices)
  - [1. Use Appropriate Log Levels](#1-use-appropriate-log-levels)
  - [2. Include Context Information](#2-include-context-information)
  - [3. Use Correlation IDs for Tracing](#3-use-correlation-ids-for-tracing)
  - [4. Sanitize Sensitive Data](#4-sanitize-sensitive-data)
  - [5. Log Third-Party Calls](#5-log-third-party-calls)
- [Troubleshooting](#troubleshooting)
  - [Common Issues](#common-issues)
    - [1. Logs Not Appearing in CloudWatch](#1-logs-not-appearing-in-cloudwatch)
    - [2. Sensitive Data in Logs](#2-sensitive-data-in-logs)
    - [3. Missing Correlation IDs](#3-missing-correlation-ids)
    - [4. Performance Impact](#4-performance-impact)
  - [Debug Mode](#debug-mode)
  - [Log Analysis](#log-analysis)

## Overview

NestForge includes a comprehensive logging system built on Morgan and Winston that provides structured logging, request tracing, and third-party API monitoring. The system supports both local development (console output) and production environments (AWS CloudWatch).

### Key Features

- **Structured JSON Logging** - All logs are formatted as JSON for easy parsing
- **Request Tracing** - Automatic correlation ID generation and tracking
- **Third-Party API Monitoring** - Built-in logging for external API calls
- **Sensitive Data Masking** - Automatic sanitization of sensitive fields
- **Environment-Aware** - Different transports for local vs production
- **Performance Tracking** - Response time and duration logging

## Architecture

The logging system follows a modular architecture with clear separation of concerns:

```
src/loggings/
├── loggings.service.ts          # Core logging service
├── loggings.module.ts           # Module definition
└── utils/
    ├── logger.utils.ts          # HTTP request/response logging
    ├── correlation-id.middleware.ts  # Correlation ID generation
    ├── request-context.interceptor.ts # Request context management
    └── request-context.service.ts     # Async context storage
```

## Configuration

The logging system is configured through environment variables and automatically adapts based on the `NODE_ENV` setting.

### Environment Variables

```bash
# Required
NODE_ENV=local|development|production

# AWS CloudWatch (production only)
AWS_LOGGING_GROUP=your-log-group
AWS_LOGGING_STREAM=your-log-stream
AWS_REGION=us-east-1

# Sensitive fields to mask
APP_MASKED_FIELDS=password,secret,token,key
```

## Core Components

### LoggingsService

The main logging service that provides structured logging capabilities.

```typescript
@Injectable()
export class LoggingsService {
  // Basic logging methods
  log(message: string, context?: string): void
  error(message: string, trace: string, context?: string): void
  warn(message: string, context?: string): void
  debug(message: string, context?: string): void

  // Third-party API logging
  logThirdPartyCallStart(params: ThirdPartyCallParams): void
  logThirdPartyCallEnd(params: ThirdPartyCallEndParams): void

  // SDK call logging
  logThirdPartySdkCallStart(params: SdkCallParams): void
  logThirdPartySdkCallEnd(params: SdkCallEndParams): void

  // Utility methods
  sanitizePayload(payload: any): any
  getLogger(): Winston.Logger
}
```

### Logger Utils

Handles HTTP request/response logging using Morgan middleware.

```typescript
export function configureLogger(
  app: INestApplication,
  loggerService: LoggingsService
): void

export function extractUserIdFromToken(authHeader?: string): string
```

**Features:**
- Automatic request/response body logging
- User ID extraction from JWT tokens
- Client IP tracking
- Response time measurement
- Custom header logging (correlation ID, user agent, etc.)

### Request Context

Manages request-scoped data using AsyncLocalStorage.

```typescript
@Injectable()
export class RequestContextService {
  run(context: RequestContext, callback: Function): void
  getCorrelationId(): string | undefined
  getUserId(): number | undefined
  getContext(): RequestContext | undefined
}
```

### Correlation ID Middleware

Automatically generates and manages correlation IDs for request tracing.

```typescript
@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void
}
```

## Usage Examples

### Basic Logging

```typescript
import { LoggingsService } from '@src/loggings/loggings.service';

@Injectable()
export class UserService {
  constructor(private readonly logger: LoggingsService) {}

  async createUser(userData: CreateUserDto) {
    this.logger.log('Creating new user', 'UserService');
    
    try {
      const user = await this.userRepository.save(userData);
      this.logger.log(`User created with ID: ${user.id}`, 'UserService');
      return user;
    } catch (error) {
      this.logger.error('Failed to create user', error.stack, 'UserService');
      throw error;
    }
  }
}
```

### HTTP Request/Response Logging

The system automatically logs all HTTP requests and responses. No additional code is required - it's configured in `main.ts`:

```typescript
// In main.ts
const loggerService = app.select(LoggingsModule).get(LoggingsService);
configureLogger(app, loggerService);
```

**Example Log Output:**
```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "level": "info",
  "message": "HTTP request/response",
  "method": "POST",
  "url": "/api/v1/users",
  "status": 201,
  "responseTime": 45,
  "correlationId": "550e8400-e29b-41d4-a716-446655440000",
  "userId": "123",
  "clientIp": "192.168.1.100",
  "requestBody": {"name": "John Doe", "email": "john@example.com"},
  "responseBody": {"id": 1, "name": "John Doe", "email": "john@example.com"}
}
```

### Third-Party API Logging

Use the `LoggingHttpService` for external API calls:

```typescript
import { LoggingHttpService } from '@src/http/logging-http.service';

@Injectable()
export class PaymentService {
  constructor(private readonly httpService: LoggingHttpService) {}

  async processPayment(paymentData: PaymentDto) {
    return this.httpService.request({
      method: 'POST',
      url: 'https://api.payment-provider.com/charges',
      data: paymentData,
      serviceName: 'PaymentProvider', // Optional: for better log categorization
    }).toPromise();
  }
}
```

**Automatic Logging:**
- Request start with payload and headers
- Response completion with status and duration
- Error handling with detailed error information

### SDK Call Logging

For SDK-based integrations:

```typescript
import { LoggingsService } from '@src/loggings/loggings.service';

@Injectable()
export class S3Service {
  constructor(private readonly logger: LoggingsService) {}

  async uploadFile(file: Buffer, key: string) {
    const startTime = Date.now();
    
    this.logger.logThirdPartySdkCallStart({
      serviceName: 'AWS S3',
      operation: 'uploadObject',
      input: { key, size: file.length },
    });

    try {
      const result = await this.s3Client.upload({
        Bucket: 'my-bucket',
        Key: key,
        Body: file,
      }).promise();

      this.logger.logThirdPartySdkCallEnd({
        serviceName: 'AWS S3',
        operation: 'uploadObject',
        durationMs: Date.now() - startTime,
        output: { location: result.Location },
      });

      return result;
    } catch (error) {
      this.logger.logThirdPartySdkCallEnd({
        serviceName: 'AWS S3',
        operation: 'uploadObject',
        durationMs: Date.now() - startTime,
        error: { message: error.message, code: error.code },
      });
      throw error;
    }
  }
}
```

## Environment Configuration

### Local Development

In local environment, logs are output to console with colored formatting:

```bash
NODE_ENV=local
```

**Console Output:**
```
Time: [2024-01-15T10:30:00.000Z] → Level: info → Method: POST → URL: /api/v1/users → Message: HTTP request/response → Status: 201 → ResponseTime: (45ms) → CorrelationId: 550e8400-e29b-41d4-a716-446655440000 → ClientIp: 192.168.1.100 → UserId: 123
```

### Production Environment

In production, logs are sent to AWS CloudWatch:

```bash
NODE_ENV=production
AWS_LOGGING_GROUP=my-app-logs
AWS_LOGGING_STREAM=api-logs
AWS_REGION=us-east-1
```

**CloudWatch Log Format:**
```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "level": "info",
  "message": "HTTP request/response",
  "method": "POST",
  "url": "/api/v1/users",
  "status": 201,
  "responseTime": 45,
  "correlationId": "550e8400-e29b-41d4-a716-446655440000",
  "userId": "123",
  "clientIp": "192.168.1.100",
  "requestBody": {"name": "John Doe"},
  "responseBody": {"id": 1, "name": "John Doe"}
}
```

## Best Practices

### 1. Use Appropriate Log Levels

```typescript
// ✅ Good
this.logger.log('User login successful', 'AuthService');
this.logger.warn('Rate limit approaching', 'RateLimitService');
this.logger.error('Database connection failed', error.stack, 'DatabaseService');

// ❌ Avoid
this.logger.log('Critical error occurred', 'ErrorService'); // Should be error level
this.logger.error('User clicked button', 'UIService'); // Should be debug level
```

### 2. Include Context Information

```typescript
// ✅ Good
this.logger.log(`Processing order ${orderId} for user ${userId}`, 'OrderService');

// ❌ Avoid
this.logger.log('Processing order', 'OrderService');
```

### 3. Use Correlation IDs for Tracing

```typescript
// The system automatically includes correlation IDs in all logs
// No additional code needed for basic logging
```

### 4. Sanitize Sensitive Data

```typescript
// Sensitive fields are automatically masked based on APP_MASKED_FIELDS
// Custom sanitization for specific cases:
const sanitizedData = this.logger.sanitizePayload(userData);
this.logger.log('User data processed', { data: sanitizedData });
```

### 5. Log Third-Party Calls

```typescript
// Always use LoggingHttpService for external API calls
// This provides automatic request/response logging and error tracking
```

## Troubleshooting

### Common Issues

#### 1. Logs Not Appearing in CloudWatch

**Symptoms:** Logs appear in console but not in CloudWatch

**Solutions:**
- Verify AWS credentials are configured
- Check CloudWatch log group and stream names
- Ensure AWS region is correct
- Verify IAM permissions for CloudWatch logging

#### 2. Sensitive Data in Logs

**Symptoms:** Passwords or tokens visible in logs

**Solutions:**
- Add field names to `APP_MASKED_FIELDS` environment variable
- Use `sanitizePayload()` method for custom data
- Review log output before deploying

#### 3. Missing Correlation IDs

**Symptoms:** Logs don't have correlation IDs

**Solutions:**
- Ensure `CorrelationIdMiddleware` is registered globally
- Check that requests include `x-correlation-id` header
- Verify middleware order in `app.module.ts`

#### 4. Performance Impact

**Symptoms:** Logging causing performance issues

**Solutions:**
- Use appropriate log levels (avoid debug in production)
- Consider log sampling for high-traffic endpoints
- Monitor CloudWatch costs and adjust retention policies

### Debug Mode

Enable debug logging for troubleshooting:

```typescript
// In your service
this.logger.debug('Detailed debug information', 'ServiceName');
```

### Log Analysis

Use CloudWatch Insights for log analysis:

```sql
-- Find all errors in the last hour
fields @timestamp, message, correlationId, userId
| filter level = "error"
| sort @timestamp desc
| limit 100

-- Track request flow by correlation ID
fields @timestamp, message, method, url, status
| filter correlationId = "550e8400-e29b-41d4-a716-446655440000"
| sort @timestamp asc
```

---

Previous: [Architecture](architecture.md)

Next: [HTTP Module](http.md)
