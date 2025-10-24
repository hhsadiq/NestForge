import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { validate as isUuid } from 'uuid';

import { UNEXPECTED_STATE_OF_IDEMPOTENCY_INTERCEPTOR } from '@src/common/error-messages';
import { AllConfigType } from '@src/config/config.type';

import { IdempotenciesService } from './idempotencies.service';
import { IdempotencyStatusEnum } from './idempotency-status.enum';

@Injectable()
export class IdempotencyInterceptor implements NestInterceptor {
  constructor(
    private readonly idempotencySvc: IdempotenciesService,
    private readonly configSvc: ConfigService<AllConfigType>,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const { idempotencyEnabled } = this.configSvc.getOrThrow('app');
    if (!idempotencyEnabled) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    const idempotencyKey = request.headers['x-idempotency-key'];

    if (!idempotencyKey) {
      throw new BadRequestException(
        "Header 'x-idempotency-key' is required for this request.",
      );
    }

    if (!this.isValidUUID(idempotencyKey)) {
      throw new BadRequestException(
        "Header 'x-idempotency-key' must be a UUID.",
      );
    }

    const cachedResponse =
      await this.idempotencySvc.getResponse(idempotencyKey);

    if (
      cachedResponse &&
      cachedResponse.status !== IdempotencyStatusEnum.failed
    ) {
      if (cachedResponse.status === IdempotencyStatusEnum.completed) {
        return of(cachedResponse.response);
      } else if (cachedResponse.status === IdempotencyStatusEnum.inProgress) {
        throw new HttpException('Processing', HttpStatus.ACCEPTED);
      }
    } else {
      await this.idempotencySvc.markInProgress(idempotencyKey);
      return next.handle().pipe(
        tap({
          next: async (response) =>
            await this.idempotencySvc.storeResponse(
              idempotencyKey,
              IdempotencyStatusEnum.completed,
              response,
            ),
          error: async (error) =>
            await this.idempotencySvc.storeResponse(
              idempotencyKey,
              IdempotencyStatusEnum.failed,
              error,
            ),
        }),
      );
    }
    throw new InternalServerErrorException(
      UNEXPECTED_STATE_OF_IDEMPOTENCY_INTERCEPTOR,
    );
  }

  private isValidUUID(uuid: string) {
    return isUuid(uuid);
  }
}
