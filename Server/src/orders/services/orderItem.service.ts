import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { OrderItem } from "../entities/orderItem.entity";
import { ClientSession, Model, Types } from "mongoose";
import { CartItemDocument } from "src/cartItem/entities/cartItem.entity";

/**
 * Service for managing order item operations.
 */
@Injectable()
export class OrderItemsService {
  constructor(@InjectModel(OrderItem.name) private orderModel: Model<OrderItem>) { }

  /**
   * Create order items for an order.
   * @param cartItems - The cart items to create order items from.
   * @param orderId - The order id.
   * @param session - The session to use for the operation.
   * @returns The created order items.
   */
  async create(cartItems: CartItemDocument[], orderId: Types.ObjectId, session?: ClientSession) {
    const orderItems: OrderItem[] = cartItems.map((cartItem) => {
      return {
        quantity: cartItem.quantity,
        cost: cartItem.cost,
        product: cartItem.product,
        order: orderId
      }
    });
    return this.orderModel.create(orderItems, { session });
  }
}