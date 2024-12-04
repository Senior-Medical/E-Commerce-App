import { MiddlewareConsumer, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ProductsModule } from "src/products/products.module";
import { ApiFeatureModule } from "src/utils/apiFeature/apiFeature.module";
import { setApiFeatureVariables } from "src/utils/apiFeature/middlewares/apiFeature.middleware";
import { CartItemController } from "./cartItem.controller";
import { CartItemService } from "./cartItem.service";
import { CartItem, CartItemSchema } from "./entities/cartItem.entity";

/**
 * CartItem Module
 * 
 * Provides functionality for managing cart items in the system.
 * Features:
 * - CRUD operations for cart items
 * - Calculates cart totals for users
 * - Validates product and user inputs
 * 
 * Dependencies:
 * - CartItem entity
 * - CartItem service and controller
 * - Product and user validation pipes
 */
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: CartItem.name,
        schema: CartItemSchema
      }
    ]),
    ProductsModule,
    ApiFeatureModule
  ],
  controllers: [CartItemController],
  providers: [CartItemService],
  exports: [CartItemService]
})
export class CartItemModule {
  constructor(private readonly cartItemService: CartItemService) { }
  
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(setApiFeatureVariables(this.cartItemService)).forRoutes(CartItemController);
  }
}