# Logging System

## Table of Contents <!-- omit in toc -->

- [Logging System](#logging-system)
  - [Overview](#overview)
    - [Key Features](#key-features)
  - [Architecture](#architecture)
  - [Configuration](#configuration)
    - [Environment Variables](#environment-variables)
  - [Usage Examples](#usage-examples)
    - [Basic Logging](#basic-logging)
    - [HTTP Request/Response Logging](#http-requestresponse-logging)
    - [Third-Party API Logging](#third-party-api-logging)
    - [SDK Call Logging](#sdk-call-logging)
  - [Environment Configuration](#environment-configuration)
    - [Local Development](#local-development)
    - [Production Environment](#production-environment)

## Overview

This project includes a comprehensive logging system built on Morgan and Winston that provides structured logging, request tracing, and third-party API monitoring. The system supports both local development (console output) and production environments (AWS CloudWatch).

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


---

Previous: [Architecture](architecture.md)

Next: [HTTP Module](http.md)
