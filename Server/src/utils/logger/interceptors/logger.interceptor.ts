import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { CustomLoggerService } from '../logger.service';

/**
 * - Intercepts HTTP requests and logs the method, URL, status code, and duration.
 * - Uses the CustomLoggerService to log this information.
 */
@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  constructor(private readonly customLoggerService: CustomLoggerService) {}

  /**
   * intercept - Intercepts the request and logs its details.
   * @param context - The execution context of the request.
   * @param next - The next handler in the request pipeline.
   * @returns The response or error.
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const { method, url } = request;
    const { statusCode } = response;
    const startTime = Date.now();
    
    const controllerName = context.getClass().name;
    const handlerName = context.getHandler().name;
    const contextName = `${controllerName}.${handlerName}`;

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startTime;
        this.customLoggerService.log(
          `${method} ${url} [${statusCode}] Duration: ${duration}ms`,
          contextName
        );
      }),
      catchError((error) => {
        error.contextName = contextName;
        throw error;
      }),
    );
  }
}
