import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { ProductsReviewsService } from '../productsReviews.service';
import { Role } from "src/auth/enums/roles.enum";

@Injectable()
export class ProductReviewPermissionGuard implements CanActivate{
  constructor(private readonly productsReviewsService: ProductsReviewsService) { }
  
  async canActivate(context: ExecutionContext) {
    const { reviewId } = context.switchToHttp().getRequest().params;
    const user = context.switchToHttp().getRequest().user;
    const review = await this.productsReviewsService.findOne(reviewId);
    if (user.role === Role.customer && user._id.toString() !== review.user.toString()) return false;
    return true;
  }
}