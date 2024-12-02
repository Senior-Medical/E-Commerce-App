import { MiddlewareConsumer, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ProductsModule } from "src/products/products.module";
import { ApiFeatureModule } from "src/utils/apiFeature/apiFeature.module";
import { setApiFeatureVariables } from "src/utils/apiFeature/middlewares/apiFeature.middleware";
import { ProductsReviews, ProductsReviewsSchema } from "./entities/productsReviews.entity";
import { ProductsReviewsController } from "./productsReviews.controller";
import { ProductsReviewsService } from './productsReviews.service';

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
    ProductsModule,
    ApiFeatureModule
  ],
  controllers: [ProductsReviewsController],
  providers: [ProductsReviewsService],
})
export class ProductsReviewsModule {
  constructor(private readonly productsReviewsService: ProductsReviewsService) { }
  
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(setApiFeatureVariables(this.productsReviewsService)).forRoutes(ProductsReviewsController);
  }
}