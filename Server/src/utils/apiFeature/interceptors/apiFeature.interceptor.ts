import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { QueryDto } from '../dto/query.dto';
import { ApiFeatureService } from '../apiFeature.service';
import { Observable } from 'rxjs';

/**
 * Interceptor to handle query building for API features such as filtering, pagination, sorting, field selection, and search.
 */
@Injectable()
export class ApiFeatureInterceptor implements NestInterceptor {
  constructor(private readonly apiFeatureService: ApiFeatureService) {}

  /**
   * Intercepts incoming requests to validate query parameters and build the Mongoose query.
   * 
   * @param context - The execution context of the request.
   * @param next - The call handler to proceed to the next middleware or handler.
   * @returns An Observable of the next handler.
   */
  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const { model, searchArray } = request.apiFeature;
    if (!model) {
      return next.handle();
    }

    const query = plainToInstance(QueryDto, request.query);

    const errors = await validate(query);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    const mongooseQuery = model.find();
    let queryBuilder = this.apiFeatureService.filter(mongooseQuery, query);
    queryBuilder = this.apiFeatureService.paginate(queryBuilder, query);
    queryBuilder = this.apiFeatureService.sort(queryBuilder, query);
    queryBuilder = this.apiFeatureService.selectFields(queryBuilder, query);
    queryBuilder = this.apiFeatureService.search(queryBuilder, searchArray, query);

    request.queryBuilder = queryBuilder;
    return next.handle();
  }
}
