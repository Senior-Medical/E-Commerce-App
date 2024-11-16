import { ArgumentMetadata, Injectable, NotFoundException, PipeTransform } from "@nestjs/common";
import { ProductsReviewsService } from "../productsReviews.service";

@Injectable()
export class ProductReviewIdPipe implements PipeTransform {
  constructor(private readonly productsReviewsService: ProductsReviewsService) { }
  
  async transform(reviewId: string, metadata: ArgumentMetadata) {
    const review = await this.productsReviewsService.findOne(reviewId);
    if (!review) throw new NotFoundException("Review not found.");
    return review;
  }
}