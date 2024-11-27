import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CartItem, CartItemSchema } from "./entities/cartItem.entity";
import { CartItemController } from "./cartItem.controller";
import { CartItemService } from "./cartItem.service";
import { ProductsModule } from "src/products/products.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: CartItem.name,
        schema: CartItemSchema
      }
    ]),
    ProductsModule
  ],
  controllers: [CartItemController],
  providers: [CartItemService]
})
export class CartItemModule {}