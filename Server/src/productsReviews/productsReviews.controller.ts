import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from "@nestjs/common";
import { Document } from "mongoose";
import { UserDecorator } from "src/common/decorators/user.decorator";
import { ObjectIdPipe } from "src/common/pipes/ObjectIdValidation.pipe";
import { ProductIdPipe } from "src/products/pipes/productIdValidation.pipe";
import { CreateProductReviewDto } from "./dtos/createProductReview.dto";
import { UpdateProductReviewDto } from "./dtos/updateProductReview.dto";
import { ProductReviewIdPipe } from "./pipes/productReviewIdValidation.pipe";
import { ProductsReviewsService } from './productsReviews.service';

@Controller("products/reviews")
export class ProductsReviewsController {
  constructor(private readonly productsReviewsService: ProductsReviewsService) { }
  
  @Get()
  find() {
    return this.productsReviewsService.find();
  }

  @Get(":reviewId")
  findOne(@Param("reviewId", ObjectIdPipe, ProductReviewIdPipe) review: Document) {
    return review;
  }

  @Post()
  create(@Body() reviewData: CreateProductReviewDto, @Body("productId", ProductIdPipe) product: Document, @UserDecorator() user: Document) {
    return this.productsReviewsService.create(reviewData, product, user);
  }

  @Patch(":reviewId")
  @HttpCode(HttpStatus.ACCEPTED)
  update(@Param("reviewId", ObjectIdPipe, ProductReviewIdPipe) review: Document, @Body() reviewData: UpdateProductReviewDto) {
    return this.productsReviewsService.update(review, reviewData);
  }

  @Delete(":reviewId")
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param("reviewId", ObjectIdPipe, ProductReviewIdPipe) review: Document) {
    await this.productsReviewsService.remove(review);
  }
}