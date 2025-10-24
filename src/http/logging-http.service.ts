import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

import { LoggingsService } from '@src/loggings/loggings.service';
import { RequestContextService } from '@src/loggings/utils/request-context.service';

@Injectable()
export class LoggingHttpService {
  constructor(
    private readonly httpService: HttpService,
    private readonly loggingsService: LoggingsService,
    private readonly requestContextService: RequestContextService,
  ) {}

  request<T>(
    config: AxiosRequestConfig & { serviceName?: string },
  ): Observable<AxiosResponse<T>> {
    const startTime = Date.now();
    const { serviceName = 'external', ...axiosConfig } = config;
    const correlationId = this.requestContextService.getCorrelationId();
    const userId = this.requestContextService.getUserId();

    // Log request start
    this.loggingsService.logThirdPartyCallStart({
      serviceName,
      method: axiosConfig.method?.toUpperCase() || 'GET',
      url: axiosConfig.url || '',
      payload: axiosConfig.data,
      headers: axiosConfig.headers as Record<string, string>,
      correlationId,
      userId,
    });

    return this.httpService.request<T>(axiosConfig).pipe(
      tap((response) => {
        const durationMs = Date.now() - startTime;
        this.loggingsService.logThirdPartyCallEnd({
          serviceName,
          method: axiosConfig.method?.toUpperCase() || 'GET',
          url: axiosConfig.url || '',
          status: response.status,
          durationMs,
          response: response.data,
          correlationId,
          userId,
        });
      }),
      catchError((error) => {
        const durationMs = Date.now() - startTime;
        this.loggingsService.logThirdPartyCallEnd({
          serviceName,
          method: axiosConfig.method?.toUpperCase() || 'GET',
          url: axiosConfig.url || '',
          status: error.response?.status || 0,
          durationMs,
          error: {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
          },
          correlationId,
          userId,
        });
        throw error;
      }),
    );
  }
}
