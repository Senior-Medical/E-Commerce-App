import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { WishList, WishListSchema } from "./entities/wishList.entity";
import { WishListController } from "./wishList.controller";
import { WishListService } from "./wishList.service";
import { ProductsModule } from "src/products/products.module";

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
    ProductsModule
  ],
  controllers: [WishListController],
  providers: [WishListService],
  exports: []
})
export class WishListModule { }