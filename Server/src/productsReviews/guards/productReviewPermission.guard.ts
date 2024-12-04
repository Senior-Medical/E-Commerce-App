import { Injectable } from "@nestjs/common";
import { ProductsReviewsService } from '../productsReviews.service';
import { PermissionBaseGuard } from "src/utils/shared/guards/permission.guard";

/**
 * A guard to check if the user has permission to access or modify a product review.
 * 
 * Dependencies:
 * - ProductsReviewsService: Fetches the review by its ID.
 */
@Injectable()
export class ProductReviewPermissionGuard extends PermissionBaseGuard {
  constructor(private readonly productsReviewsService: ProductsReviewsService) {
    super();
  }

  findEntity(id: string): Promise<any> {
    return this.productsReviewsService.findOne(id);
  }
  getEntityOwnerId(entity: any): string {
    return entity.user.toString();
  }
  getEntityKeyInRequest(): string {
    return ProductsReviewsService.getEntityName();
  }
}