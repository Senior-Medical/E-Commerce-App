import { Injectable } from '@nestjs/common';
import { ProductsReviewsService } from '../productsReviews.service';

@Injectable()
export class SetApiFeatureVariableForProductsReviews {
  constructor(private readonly productsReviewsService: ProductsReviewsService) {}

  use(req: any, res: any, next: () => void) {
    req.apiFeature = {
      model: this.productsReviewsService.getModel(),
      searchArray: this.productsReviewsService.getSearchKeys()
    }
    next();
  }
}
