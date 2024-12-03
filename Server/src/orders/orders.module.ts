import { Module } from "@nestjs/common";
import { OrdersController } from "./orders.controller";
import { OrdersService } from "./orders.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Order, OrderSchema } from "./entities/orders.entity";
import { CartItemModule } from "src/cartItem/cartItem.module";
import { AddressesModule } from "src/addresses/addresses.module";
import { OrderItemsService } from "./services/orderItem.service";
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
    AddressesModule
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrderItemsService]
})
export class OrdersModule { }