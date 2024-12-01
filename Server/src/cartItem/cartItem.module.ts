import { MiddlewareConsumer, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CartItem, CartItemSchema } from "./entities/cartItem.entity";
import { CartItemController } from "./cartItem.controller";
import { CartItemService } from "./cartItem.service";
import { ProductsModule } from "src/products/products.module";
import { ApiFeatureModule } from "src/apiFeature/apiFeature.module";
import { SetApiFeatureVariableForCartItem } from "./middlewares/setApiFeatureVariablesForCartItem.middleware";

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
  providers: [CartItemService]
})
export class CartItemModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SetApiFeatureVariableForCartItem).forRoutes(CartItemController);
  }
}