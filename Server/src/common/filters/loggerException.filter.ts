import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { CustomLogger } from '../services/customLogger.service';

@Injectable()
@Catch()
export class LoggerExceptionFilter implements ExceptionFilter {
  constructor(private readonly customLogger: CustomLogger) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();  

    const statusCode = 
    exception instanceof HttpException
    ? exception.getStatus()
    : 500;
    
    const exceptionResponse: any = exception instanceof HttpException
    ? exception.getResponse()
    : exception instanceof Error
    ? exception.message
    : {message: 'Unknown error'};
    
    
    if (!request.log) { 
      const { method, url } = request;
      const errorMessage = exception instanceof HttpException
        ? (exception.getResponse()as object)['message']
        : exception instanceof Error
          ? exception.message : 'Unknown error';
      
      const duration = Date.now() - (request.startTime || Date.now());
      const contextName = "Exception Filter";
      this.customLogger.error(
        `${method} ${url} [${statusCode}] Duration: ${duration}ms Error: ${errorMessage}`,
        contextName
      );
    }
    
    response.status(statusCode).json(exceptionResponse);
  }
}
