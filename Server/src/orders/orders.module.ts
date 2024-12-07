import { MiddlewareConsumer, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AddressesModule } from "src/addresses/addresses.module";
import { CartItemModule } from "src/cartItem/cartItem.module";
import { ApiFeatureModule } from "src/utils/apiFeature/apiFeature.module";
import { setApiFeatureVariables } from "src/utils/apiFeature/middlewares/apiFeature.middleware";
import { Order, OrderSchema } from "./entities/orders.entity";
import { OrdersController } from "./orders.controller";
import { OrdersService } from "./orders.service";
import { OrderItem, OrderItemSchema } from "./entities/orderItem.entity";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Order.name,
        schema: OrderSchema
      },
      {
        name: OrderItem.name,
        schema: OrderItemSchema
      }
    ]),
    CartItemModule,
    AddressesModule,
    ApiFeatureModule
  ],
  controllers: [OrdersController],
  providers: [OrdersService]
})
export class OrdersModule {
  constructor(private readonly ordersService: OrdersService) { }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(setApiFeatureVariables(this.ordersService)).forRoutes(OrdersController);
  }
}