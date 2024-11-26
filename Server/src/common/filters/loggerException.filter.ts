import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { CustomLogger } from '../services/customLogger.service';
import { BaseExceptionFilter } from '@nestjs/core';

@Injectable()
@Catch()
export class LoggerExceptionFilter extends BaseExceptionFilter implements ExceptionFilter {
  constructor(private readonly customLogger: CustomLogger) {
    super();
  }

  catch(exception: unknown, host: ArgumentsHost) {
    const request = host.switchToHttp().getRequest();

    if (!request.log) {
      const { method, url } = request;
      const statusCode = 
      exception instanceof HttpException
      ? exception.getStatus()
      : 500;
      const errorMessage = exception instanceof HttpException
        ? exception.getResponse()
        : exception instanceof Error
          ? exception.message
          : 'Unknown error';
      
      const duration = Date.now() - (request.startTime || Date.now());
      const contextName = "Exception Filter";
      this.customLogger.error(
        `${method} ${url} [${statusCode}] Duration: ${duration}ms Error: ${errorMessage}`,
        contextName
      );
    }
    
    super.catch(exception, host);
  }
}
