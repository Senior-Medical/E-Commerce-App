import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ProductsReviews, ProductsReviewsSchema } from "./entities/productsReviews.entity";
import { ProductsReviewsController } from "./productsReviews.controller";
import { ProductsReviewsService } from './productsReviews.service';
import { ProductsModule } from "src/products/products.module";

/**
 * - The module responsible for managing product reviews.
 * - It imports the necessary schema for product reviews and the products module for 
 *    managing products associated with the reviews.
 * - This module provides the `ProductsReviewsService` to handle business logic and the 
 *    `ProductsReviewsController` to manage HTTP requests related to product reviews.
 * 
 * Dependencies:
 * - MongooseModule: Registers the product reviews schema with Mongoose.
 * - ProductsModule: Provides access to product-related data.
 */
@Module({
  imports: [
    MongooseModule.forFeature([
        {
          name: ProductsReviews.name,
          schema: ProductsReviewsSchema
        }
    ]),
    ProductsModule
  ],
  controllers: [ProductsReviewsController],
  providers: [ProductsReviewsService],
})
export class ProductsReviewsModule { }