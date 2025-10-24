import { AsyncLocalStorage } from 'async_hooks';

import { Injectable, Scope } from '@nestjs/common';

interface RequestContext {
  correlationId: string;
  userId?: number;
}

@Injectable({ scope: Scope.DEFAULT })
export class RequestContextService {
  private readonly asyncLocalStorage = new AsyncLocalStorage<RequestContext>();

  run(context: RequestContext, callback: (...args: any[]) => void) {
    this.asyncLocalStorage.run(context, callback);
  }

  getCorrelationId(): string | undefined {
    const store = this.asyncLocalStorage.getStore();
    return store?.correlationId;
  }

  getUserId(): number | undefined {
    const store = this.asyncLocalStorage.getStore();
    return store?.userId;
  }

  getContext(): RequestContext | undefined {
    return this.asyncLocalStorage.getStore();
  }
}
