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

  catch(exception: any, host: ArgumentsHost) {
    const request = host.switchToHttp().getRequest();

    if (!request.log) {
      const { method, url } = request;
      const statusCode = 
      exception instanceof HttpException
      ? exception.getStatus()
      : 500;
      const errorMessage = exception.message;
      
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
