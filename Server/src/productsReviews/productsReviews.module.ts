import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ProductsReviews, ProductsReviewsSchema } from "./entities/productsReviews.entity";
import { ProductsReviewsController } from "./productsReviews.controller";
import { ProductsReviewsService } from './productsReviews.service';
import { ProductsModule } from "src/products/products.module";

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