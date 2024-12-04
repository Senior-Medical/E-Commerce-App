import { MiddlewareConsumer, Module } from "@nestjs/common";
import { OrdersController } from "./orders.controller";
import { OrdersService } from "./orders.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Order, OrderSchema } from "./entities/orders.entity";
import { CartItemModule } from "src/cartItem/cartItem.module";
import { AddressesModule } from "src/addresses/addresses.module";
import { OrderItemsService } from "./services/orderItem.service";
import { OrderItem, OrderItemSchema } from "./entities/orderItem.entity";
import { setApiFeatureVariables } from "src/utils/apiFeature/middlewares/apiFeature.middleware";
import { ApiFeatureModule } from "src/utils/apiFeature/apiFeature.module";

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
  providers: [OrdersService, OrderItemsService]
})
export class OrdersModule {
  constructor(private readonly ordersService: OrdersService) { }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(setApiFeatureVariables(this.ordersService)).forRoutes(OrdersController);
  }
}