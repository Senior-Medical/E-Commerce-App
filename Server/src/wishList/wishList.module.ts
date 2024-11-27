import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { WishList, WishListSchema } from "./entities/wishList.entity";
import { WishListController } from "./wishList.controller";
import { WishListService } from "./wishList.service";
import { ProductsModule } from "src/products/products.module";

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