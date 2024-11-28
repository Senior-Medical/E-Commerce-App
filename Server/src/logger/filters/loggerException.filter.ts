import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  Injectable,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { CustomLoggerService } from '../logger.service';

@Injectable()
@Catch()
export class LoggerExceptionFilter extends BaseExceptionFilter implements ExceptionFilter {
  constructor(private readonly customLoggerService: CustomLoggerService) {
    super();
  }

  catch(exception: any, host: ArgumentsHost) {
    const statusCode = exception.getStatus() || 500;
    const errorMessage = exception.message || "Internal server error";
    const contextName = exception.contextName || 'Unknown';
    
    const request = host.switchToHttp().getRequest();
    const { method, url } = request;
    const duration = Date.now() - (request.startTime || Date.now());

    this.customLoggerService.error(
      `${method} ${url} [${statusCode}] Duration: ${duration}ms Error: ${errorMessage}`,
      contextName
    );
    super.catch(exception, host);
  }
}
