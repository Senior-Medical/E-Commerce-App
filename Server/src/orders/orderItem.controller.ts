import { Body, Controller, Delete, Get, ParseIntPipe, Patch, UseGuards } from "@nestjs/common";
import { GetObjectFromRequestDecorator } from "src/utils/shared/decorators/getObjectFromRequest.decorator";
import { OrderItemDocument } from "./entities/orderItem.entity";
import { OrderDocument } from "./entities/orders.entity";
import { OrderItemPermissionGuard } from "./guards/orderItemPermission.guard";
import { OrderPermissionGuard } from "./guards/orderPermission.guard";
import { OrdersService } from "./orders.service";

@Controller('orderItem')
export class OrderItemController {
  constructor(
    private readonly ordersService: OrdersService,
  ) { }

  /**
   * Retrieves order items by order ID.
   * @param order - The order document.
   * @returns The order document.
   */
  @Get(`:${OrdersService.getEntityName()}Id`)
  @UseGuards(OrderPermissionGuard)
  findOne(@GetObjectFromRequestDecorator(OrdersService.getEntityName()) order: OrderDocument) {
    return this.ordersService.findItems(order._id);
  }

  /**
   * Updates order items by order item ID.
   * @param orderItem - The order Item document.
   * @returns The updated order Item document.
   */
  @Patch(`:${OrdersService.getItemEntityName()}Id`)
  @UseGuards(OrderItemPermissionGuard)
  updateItemQuantity(
    @GetObjectFromRequestDecorator(OrdersService.getItemEntityName()) orderItem: OrderItemDocument,
    @Body('quantity', ParseIntPipe) quantity: number
  ) {
    return this.updateItemQuantity(orderItem, quantity);
  }

  /**
   * Deletes order items by order item ID.
   * @param orderItem - The order Item document.
   */
  @Delete(`:${OrdersService.getItemEntityName()}Id`)
  @UseGuards(OrderItemPermissionGuard)
  remove(@GetObjectFromRequestDecorator(OrdersService.getItemEntityName()) orderItem: OrderItemDocument) {
    return this.ordersService.removeItem(orderItem);
  }
}