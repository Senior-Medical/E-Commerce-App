import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { Document } from "mongoose";
import { Public } from "src/auth/decorators/public.decorator";
import { Roles } from "src/auth/decorators/roles.decorator";
import { Role } from "src/auth/enums/roles.enum";
import { ObjectIdPipe } from "src/common/pipes/ObjectIdValidation.pipe";
import { ProductIdPipe } from "src/products/pipes/productIdValidation.pipe";
import { UserDecorator } from "src/users/decorators/user.decorator";
import { CreateProductReviewDto } from "./dtos/createProductReview.dto";
import { UpdateProductReviewDto } from "./dtos/updateProductReview.dto";
import { CheckReviewOwnerGuard } from "./guards/checkReviewOwner.guard";
import { ProductReviewIdPipe } from "./pipes/productReviewIdValidation.pipe";
import { ProductsReviewsService } from './productsReviews.service';

@Controller("products/reviews")
export class ProductsReviewsController {
  constructor(private readonly productsReviewsService: ProductsReviewsService) { }
  
  @Get("/all/:productId")
  @Public()
  find(@Param("productId", ObjectIdPipe, ProductIdPipe) product: Document) {
    return this.productsReviewsService.find({product: product._id});
  }

  @Get(":reviewId")
  @Public()
  findOne(@Param("reviewId", ObjectIdPipe, ProductReviewIdPipe) review: Document) {
    return review;
  }

  @Post()
  @Roles(Role.customer)
  create(@Body() reviewData: CreateProductReviewDto, @UserDecorator() user: Document) {
    return this.productsReviewsService.create(reviewData, user);
  }

  @Patch(":reviewId")
  @HttpCode(HttpStatus.ACCEPTED)
  @Roles(Role.customer)
  @UseGuards(CheckReviewOwnerGuard)
  update(@Param("reviewId", ObjectIdPipe, ProductReviewIdPipe) review: Document, @Body() reviewData: UpdateProductReviewDto) {
    return this.productsReviewsService.update(review, reviewData);
  }

  @Delete(":reviewId")
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(Role.customer)
  @UseGuards(CheckReviewOwnerGuard)
  async remove(@Param("reviewId", ObjectIdPipe, ProductReviewIdPipe) review: Document) {
    await this.productsReviewsService.remove(review);
  }
}