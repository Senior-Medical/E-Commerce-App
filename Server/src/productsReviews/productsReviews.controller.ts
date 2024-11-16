import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { Document } from "mongoose";
import { UserDecorator } from "src/common/decorators/user.decorator";
import { ObjectIdPipe } from "src/common/pipes/ObjectIdValidation.pipe";
import { ProductIdPipe } from "src/products/pipes/productIdValidation.pipe";
import { CreateProductReviewDto } from "./dtos/createProductReview.dto";
import { UpdateProductReviewDto } from "./dtos/updateProductReview.dto";
import { ProductReviewIdPipe } from "./pipes/productReviewIdValidation.pipe";
import { ProductsReviewsService } from './productsReviews.service';
import { JwtAuthGuard } from "src/auth/guards/jwtAuth.guard";

@Controller("products/reviews")
@UseGuards(JwtAuthGuard)
export class ProductsReviewsController {
  constructor(private readonly productsReviewsService: ProductsReviewsService) { }
  
  @Get("/all/:productId")
  find(@Param("productId", ObjectIdPipe, ProductIdPipe) product: Document) {
    return this.productsReviewsService.find({product: product._id});
  }

  @Get(":reviewId")
  findOne(@Param("reviewId", ObjectIdPipe, ProductReviewIdPipe) review: Document) {
    return review;
  }

  @Post()
  create(@Body() reviewData: CreateProductReviewDto, @UserDecorator() user: Document) {
    return this.productsReviewsService.create(reviewData, user);
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