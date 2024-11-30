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

@Injectable()
export class ApiFeatureInterceptor implements NestInterceptor {
  constructor(private readonly apiFeatureService: ApiFeatureService) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const { model, searchArray } = request.apiFeature; // The model is attached by middleware or service logic
    if (!model) {
      return next.handle();
    }

    const query = plainToInstance(QueryDto, request.query);

    // Validate query parameters
    const errors = await validate(query);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    // Apply query features using the model
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
