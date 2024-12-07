import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderReviewDto } from './createOrderReview.dto';

export class UpdateOrderReviewDto extends PartialType(CreateOrderReviewDto) {}
