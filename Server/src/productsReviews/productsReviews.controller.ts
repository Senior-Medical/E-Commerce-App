import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Req, UseGuards, UseInterceptors } from "@nestjs/common";
import { Document, Query } from "mongoose";
import { Public } from "src/auth/decorators/public.decorator";
import { ObjectIdPipe } from "src/common/pipes/ObjectIdValidation.pipe";
import { ProductIdPipe } from "src/products/pipes/productIdValidation.pipe";
import { UserDecorator } from "src/users/decorators/user.decorator";
import { CreateProductReviewDto } from "./dtos/createProductReview.dto";
import { UpdateProductReviewDto } from "./dtos/updateProductReview.dto";
import { ProductReviewPermissionGuard } from "./guards/productReviewPermission.guard";
import { ProductReviewIdPipe } from "./pipes/productReviewIdValidation.pipe";
import { ProductsReviewsService } from './productsReviews.service';
import { ApiFeatureInterceptor } from "src/apiFeature/interceptors/apiFeature.interceptor";
import { Request } from "express";
import { ProductsReviews } from "./entities/productsReviews.entity";
import { Product } from "src/products/entities/products.entity";

/**
 * Controller for handling product review-related HTTP requests, including
 * CRUD operations and fetching reviews for specific products.
 */
@Controller("products/reviews")
export class ProductsReviewsController {
  constructor(private readonly productsReviewsService: ProductsReviewsService) { }

  /**
   * Retrieves all reviews for a specific product.
   * 
   * @param productId - Unique identifier of the product.
   * @returns Array of reviews for the specified product.
   */
  @Get("/product/:productId")
  @Public()
  @UseInterceptors(ApiFeatureInterceptor)
  find(@Req() req: Request & { queryBuilder: Query<ProductsReviews, Document> }, @Param("productId", ObjectIdPipe, ProductIdPipe) product: Document & Product) {
    return this.productsReviewsService.find(req, product).populate("user", "name username");
  }

  /**
   * Fetches a single product review by its ID with populated user and product details.
   * 
   * @param reviewId - Unique identifier of the review.
   * @returns Product review document.
   */
  @Get(":reviewId")
  @Public()
  async findOne(@Param("reviewId", ObjectIdPipe, ProductReviewIdPipe) review: Document) {
    return (await review.populate("user", "name username")).populate("product", "name");
  }

  /**
   * Creates a new review for a product.
   * 
   * @param reviewData - Data for the new review.
   * @param user - User creating the review.
   * @returns Created product review.
   */
  @Post()
  create(@Body() reviewData: CreateProductReviewDto, @UserDecorator() user: Document) {
    return this.productsReviewsService.create(reviewData, user);
  }

  /**
   * Updates an existing product review.
   * 
   * @param reviewId - Unique identifier of the review to update.
   * @param reviewData - Data to update the review with.
   * @returns Updated product review.
   */
  @Patch(":reviewId")
  @HttpCode(HttpStatus.ACCEPTED)
  @UseGuards(ProductReviewPermissionGuard)
  update(@Param("reviewId", ObjectIdPipe, ProductReviewIdPipe) review: Document, @Body() reviewData: UpdateProductReviewDto) {
    return this.productsReviewsService.update(review, reviewData);
  }

  /**
   * Deletes a specific product review.
   * 
   * @param reviewId - Unique identifier of the review to delete.
   * @returns No content response.
   */
  @Delete(":reviewId")
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(ProductReviewPermissionGuard)
  async remove(@Param("reviewId", ObjectIdPipe, ProductReviewIdPipe) review: Document) {
    await this.productsReviewsService.remove(review);
  }
}