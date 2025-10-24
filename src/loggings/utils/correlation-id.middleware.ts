import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction) {
    const existingCorrelationId = req.headers['x-correlation-id'];
    const correlationId =
      typeof existingCorrelationId === 'string'
        ? existingCorrelationId
        : uuidv4();

    // Store it on the request for later use
    req.headers['x-correlation-id'] = correlationId;

    next();
  }
}
