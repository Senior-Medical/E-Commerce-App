import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { ProductsReviewsService } from '../productsReviews.service';

@Injectable()
export class CheckReviewOwnerGuard implements CanActivate{
  constructor(private readonly productsReviewsService: ProductsReviewsService) { }
  
  async canActivate(context: ExecutionContext) {
    const params = context.switchToHttp().getRequest().params;
    const user = context.switchToHttp().getRequest().user;
    const review = await this.productsReviewsService.findOne(params.reviewId);
    return user._id.toString() === review.user.toString();
  }
}