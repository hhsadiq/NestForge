import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import chalk from 'chalk';
import { Format } from 'logform';
import { createLogger, format, transports } from 'winston';
import WinstonCloudWatch from 'winston-cloudwatch';
import TransportStream from 'winston-transport';

@Injectable()
export class LoggingsService {
  private logger: any;

  constructor(private configService: ConfigService) {
    this.initializeLogger();
  }

  private initializeLogger() {
    const dynamicLevelFormat = format((info) => {
      info.level = this.determineLogLevel(info.status, info.level);
      return info;
    });

    const nodeEnv = this.configService.getOrThrow('app.nodeEnv', {
      infer: true,
    });

    const transportsArray: TransportStream[] = [];

    if (nodeEnv === 'local') {
      transportsArray.push(this.createConsoleTransport());
    } else {
      transportsArray.push(this.createCloudWatchTransport());
    }

    this.logger = createLogger({
      level: 'info',
      format: format.combine(
        format.timestamp(),
        format.json(),
        dynamicLevelFormat(),
      ),
      transports: transportsArray,
    });
  }

  private createConsoleTransport() {
    return new transports.Console({
      format: this.getConsoleFormat(),
    });
  }

  private getConsoleFormat(): Format {
    return format.combine(
      format.printf(
        ({
          timestamp,
          level,
          message,
          method,
          url,
          status,
          responseTime,
          correlationId,
          userId,
          requestBody,
          responseBody,
          clientIp,
          contentType,
          userAgent,
          appVersion,
          platform,
          xIdempotentKey,
        }) => {
          const coloredItems = this.colorize(level, message, status);
          return `Time: [${chalk.gray(timestamp)}] → Level: ${coloredItems.level} → Method: ${chalk.keyword('blue')(method)} → URL: ${url} → Message: ${coloredItems.message} → Status: ${coloredItems.status} → ResponseTime: (${responseTime}ms) → CorrelationId: ${correlationId} → ClientIp: ${clientIp} → ContentType: ${contentType} → UserAgent: ${userAgent} → AppVersion: ${appVersion} → Platform: ${platform}  → IdempotencyKey: ${xIdempotentKey} → UserId: ${userId} → Request: ${JSON.stringify(requestBody)} → Response: ${JSON.stringify(responseBody)}`;
        },
      ),
    );
  }

  private determineLogLevel(status, defaultLevel) {
    if (status >= 500) return 'error';
    if (status >= 400) return 'warn';
    return defaultLevel;
  }

  private colorize(level, message, status) {
    switch (level) {
      case 'error':
        return {
          level: chalk.red(level),
          message: chalk.red(message),
          status: chalk.red(status),
        };
      case 'warn':
        return {
          level: chalk.keyword('orange')(level),
          message: chalk.keyword('orange')(message),
          status: chalk.keyword('orange')(status),
        };
      case 'info':
        return {
          level: chalk.green(level),
          message: chalk.green(message),
          status: chalk.green(status),
        };
      case 'debug':
        return {
          level: chalk.keyword('blue')(level),
          message: chalk.keyword('blue')(message),
          status: chalk.keyword('blue')(status),
        };
      default:
        return {
          level,
          message,
          status,
        };
    }
  }

  private createCloudWatchTransport() {
    return new WinstonCloudWatch({
      logGroupName: this.configService.get<string>('aws.loggingGroup', {
        infer: true,
      }),
      logStreamName: this.configService.get<string>('aws.loggingStream', {
        infer: true,
      }),
      awsRegion: this.configService.get<string>('aws.region', { infer: true }),
      jsonMessage: true,
      ensureLogGroup: false,
    });
  }

  sanitizePayload(payload) {
    if (!payload || typeof payload !== 'object') return payload;

    const sensitiveFields = this.configService.get('app.maskedFields', {
      infer: true,
    });
    const sanitizedPayload = { ...payload };

    for (const field of sensitiveFields ?? []) {
      if (sanitizedPayload[field]) {
        sanitizedPayload[field] = '*****'; // Mask sensitive fields
      }
    }

    return sanitizedPayload;
  }

  getLogger() {
    return this.logger;
  }

  log(message: string, context?: string) {
    this.logger.info(message, { context });
  }

  error(message: string, trace: string, context?: string) {
    this.logger.error(message, { trace, context });
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, { context });
  }

  debug(message: string, context?: string) {
    this.logger.debug(message, { context });
  }

  logThirdPartyCallStart(params: {
    serviceName: string;
    method: string;
    url: string;
    payload?: any;
    headers?: Record<string, string>;
    correlationId?: string;
    userId?: number;
  }) {
    const {
      serviceName,
      method,
      url,
      payload,
      headers,
      correlationId,
      userId,
    } = params;
    const sanitizedPayload = this.sanitizePayload(payload);
    const sanitizedHeaders = this.sanitizePayload(headers);

    this.logger.info(`${serviceName} API call started`, {
      serviceName,
      method,
      url,
      payload: sanitizedPayload,
      headers: sanitizedHeaders,
      correlationId,
      userId,
      type: 'third_party_call_start',
    });
  }

  logThirdPartyCallEnd(params: {
    serviceName: string;
    method: string;
    url: string;
    status: number;
    durationMs: number;
    response?: any;
    error?: any;
    correlationId?: string;
    userId?: number;
  }) {
    const {
      serviceName,
      method,
      url,
      status,
      durationMs,
      response,
      error,
      correlationId,
      userId,
    } = params;
    const sanitizedResponse = this.sanitizePayload(response);
    const sanitizedError = this.sanitizePayload(error);

    const logData = {
      serviceName,
      method,
      url,
      status,
      durationMs,
      correlationId,
      userId,
      type: 'third_party_call_end',
    };

    if (error) {
      this.logger.error(`${serviceName} API call failed`, {
        ...logData,
        error: sanitizedError,
      });
    } else {
      this.logger.info(`${serviceName} API call completed`, {
        ...logData,
        response: sanitizedResponse,
      });
    }
  }

  logThirdPartySdkCallStart(params: {
    serviceName: string;
    operation: string;
    input?: any;
    correlationId?: string;
    userId?: number;
  }) {
    const { serviceName, operation, input, correlationId, userId } = params;
    const sanitizedInput = this.sanitizePayload(input);

    this.logger.info(`${serviceName} SDK call started`, {
      serviceName,
      operation,
      input: sanitizedInput,
      correlationId,
      userId,
      type: 'third_party_sdk_call_start',
    });
  }

  logThirdPartySdkCallEnd(params: {
    serviceName: string;
    operation: string;
    durationMs: number;
    output?: any;
    error?: any;
    correlationId?: string;
    userId?: number;
  }) {
    const {
      serviceName,
      operation,
      durationMs,
      output,
      error,
      correlationId,
      userId,
    } = params;
    const sanitizedOutput = this.sanitizePayload(output);
    const sanitizedError = this.sanitizePayload(error);

    const logData = {
      serviceName,
      operation,
      durationMs,
      correlationId,
      userId,
      type: 'third_party_sdk_call_end',
    };

    if (error) {
      this.logger.error(`${serviceName} SDK call failed`, {
        ...logData,
        error: sanitizedError,
      });
    } else {
      this.logger.info(`${serviceName} SDK call completed`, {
        ...logData,
        output: sanitizedOutput,
      });
    }
  }
}
