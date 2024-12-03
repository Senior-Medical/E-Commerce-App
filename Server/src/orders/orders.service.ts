import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { Order } from "./entities/orders.entity";
import { Connection, Model } from "mongoose";
import { UserDocument } from "src/users/entities/users.entity";
import { AddressDocument } from "src/addresses/entities/addresses.entity";
import { CartItemService } from "src/cartItem/cartItem.service";
import { OrderItemsService } from "./services/orderItem.service";

/**
 * Service for managing orders operations
 */
@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectConnection() private readonly connection: Connection,
    private readonly orderItemService: OrderItemsService,
    private readonly cartItemService: CartItemService,
  ) { }

  /**
   * Get model of this service to use it in api feature module
   */
  getModel() {
    return this.orderModel;
  }

  /**
   * Get available keys in the entity that may need in search
   */
  getSearchKeys() {
    return [
      "price",
      "user"
    ];
  }

  /**
   * Create a new order
   * @param user - The user document
   * @param address - The address document
   * @returns The created order
   */
  async create(user: UserDocument, address: AddressDocument) {
    const cartItems = await this.cartItemService.findByUser(user._id);
    if (cartItems.length === 0) throw new NotFoundException("Cart is empty");
    console.log("cartItems: ", cartItems);
    const order: Order = {
      cost: user.cartTotal,
      user: user._id,
      address: address._id,
    };

    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const createdOrder = (await this.orderModel.create([order], { session }))[0];
      const createdOrderItems = await this.orderItemService.create(cartItems, createdOrder._id, session);
      user.cartTotal = 0;
      await user.save({ session });
      await this.cartItemService.removeByUser(user._id, session);

      await session.commitTransaction();
      session.endSession();
      return {order: createdOrder, orderItems: createdOrderItems};
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }
}