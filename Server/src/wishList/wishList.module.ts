import { MiddlewareConsumer, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ProductsModule } from "src/products/products.module";
import { ApiFeatureModule } from "src/utils/apiFeature/apiFeature.module";
import { setApiFeatureVariables } from "src/utils/apiFeature/middlewares/apiFeature.middleware";
import { WishList, WishListSchema } from "./entities/wishList.entity";
import { WishListController } from "./wishList.controller";
import { WishListService } from "./wishList.service";

/**
 * WishList Module
 * 
 * Handles wishlist management for users.
 * Features:
 * - CRUD operations for wishlist items
 * - Ensures product uniqueness in a user's wishlist
 * - Populates product details in responses
 * 
 * Dependencies:
 * - WishList entity
 * - WishList service and controller
 * - Product and user validation pipes
 */
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: WishList.name, schema: WishListSchema }
    ]),
    ProductsModule,
    ApiFeatureModule
  ],
  controllers: [WishListController],
  providers: [WishListService],
  exports: []
})
export class WishListModule {
  constructor(private readonly wishListService: WishListService) { }
  
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(setApiFeatureVariables(this.wishListService)).forRoutes(WishListController);
  }
}