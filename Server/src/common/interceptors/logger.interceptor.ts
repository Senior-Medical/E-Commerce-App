import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { CustomLogger } from '../services/customLogger.service';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  constructor(private readonly customLogger: CustomLogger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const { method, url } = request;
    const { statusCode } = response;
    const startTime = Date.now();
    
    const controllerName = context.getClass().name;
    const handlerName = context.getHandler().name;
    const contextName = `${controllerName}.${handlerName}`;
    console.log(contextName)

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startTime;
        this.customLogger.log(
          `${method} ${url} [${statusCode}] Duration: ${duration}ms`,
          contextName
        );
      }),
      catchError((error) => {
        const duration = Date.now() - startTime;
        this.customLogger.error(
          `${method} ${url} [${statusCode}] Duration: ${duration}ms Error: ${error.message}`,
          contextName
        );
        request.log = true
        throw error;
      }),
    );
  }
}
