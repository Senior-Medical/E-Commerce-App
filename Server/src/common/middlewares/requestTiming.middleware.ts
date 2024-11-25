import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestTimingMiddleware implements NestMiddleware {
  use(req: Request & {startTime: number}, res: Response, next: NextFunction) {
    req.startTime = Date.now();
    next();
  }
}