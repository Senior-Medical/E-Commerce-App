import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { ClientSession, Connection, Model, Query, Types } from "mongoose";
import { AddressDocument } from "src/addresses/entities/addresses.entity";
import { Role } from "src/auth/enums/roles.enum";
import { CartItemService } from "src/cartItem/cartItem.service";
import { UserDocument } from "src/users/entities/users.entity";
import { Order, OrderDocument } from "./entities/orders.entity";
import { OrderStatus } from "./enums/orderStatus.enum";
import { OrderItem, OrderItemDocument } from "./entities/orderItem.entity";
import { CartItemDocument } from "src/cartItem/entities/cartItem.entity";

/**
 * Service for managing orders operations
 */
@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(OrderItem.name) private orderItemModel: Model<OrderItem>,
    @InjectConnection() private readonly connection: Connection,
    private readonly cartItemService: CartItemService
  ) { }

  /**
   * Get model of this service to use it in api feature module
   * @returns - The order model
   */
  getModel() {
    return this.orderModel;
  }

  /**
   * Get available keys in the entity that may need in search
   * @returns - Array of strings that contain keys names
   */
  getSearchKeys() {
    return [
      "cost"
    ];
  }

  /**
   * Get the key that is used to save entity in the request and used to name the id in urls.
   */
  static getEntityName() {
    return Order.name;
  }

  /**
   * Get the entity name for use in permission guards.
   */
  static getItemEntityName() {
    return OrderItem.name;
  }

  /**
   * Retrieves orders based on specified query parameter.
   * @param req - Request object containing the query builder and user
   * @returns A list of orders excluding the `__v` field
   */
  find(req: Request & { queryBuilder: Query<Order, OrderDocument>, user: UserDocument }) {
    const user = req.user;
    const queryBuilder = req.queryBuilder;
    if (!queryBuilder) throw new InternalServerErrorException("Query builder not found.");
    if(user.role === Role.customer) return queryBuilder.find({ user: user._id }).select("-__v");
    else return queryBuilder.select("-__v");
  }

  /**
   * Retrieves a order by ID.
   * @param id - The order ID
   * @returns The order document
   */
  findOne(id: string) {
    return this.orderModel.findById(id).select("-__v");
  }

  /**
   * Find order items by order ID.
   * @param orderId - The order ID.
   * @returns The order items.
   */
  async findItems(orderId: Types.ObjectId) {
    return this.orderItemModel.find({ order: orderId });
  }

  /**
   * Find order item by ID.
   * @param orderItemId - The order item ID.
   * @returns The order item.
   */
  async findOneItem(orderItemId: string) {
    return this.orderItemModel.findById(orderItemId);
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
      const createdOrderItems = await this.createItem(cartItems, createdOrder._id, session);
      user.cartTotal = 0;
      await user.save({ session });
      await this.cartItemService.removeByUser(user._id, session);
      await session.commitTransaction();
      return { order: createdOrder, orderItems: createdOrderItems };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

    /**
   * Create order items for an order.
   * @param cartItems - The cart items to create order items from.
   * @param orderId - The order id.
   * @param session - The session to use for the operation.
   * @returns The created order items.
   */
  async createItem(cartItems: CartItemDocument[], orderId: Types.ObjectId, session?: ClientSession) {
    const orderItems: OrderItem[] = cartItems.map((cartItem) => {
      return {
        quantity: cartItem.quantity,
        cost: cartItem.cost,
        product: cartItem.product,
        order: orderId
      }
    });
    return this.orderItemModel.create(orderItems, { session });
  }

  /**
   * Update order status
   * @param order - The order document
   * @returns The updated order
   */
  async updateStatus(order: OrderDocument) {
    switch (order.status) {
      case OrderStatus.PENDING:
        order.status = OrderStatus.PROCESSING;
        break;
      case OrderStatus.PROCESSING:
        order.status = OrderStatus.SHIPPED;
        break;
      case OrderStatus.SHIPPED:
        order.status = OrderStatus.DELIVERED;
        break;
      default:
        throw new ForbiddenException("Order is already delivered or canceled");
    }
    return order.save();
  }

  /**
   * Cancel the order
   * @param order - The order document
   * @returns The updated order
   */
  async cancelOrder(order: OrderDocument) {
    if (![OrderStatus.PENDING, OrderStatus.PROCESSING].includes(order.status)) throw new ForbiddenException("You can't cancel order after it's shipped, delivered or canceled");
    order.status = OrderStatus.CANCELED;
    return order.save();
  }

  /**
   * Update the address of the order
   * @param order - The order document
   * @param address - The address document
   * @returns The updated order
   */
  async updateAddress(order: Partial<OrderDocument>, address: AddressDocument) {
    if(order.user.toString() !== address.user.toString()) throw new ForbiddenException("You can't set a user's address to order of another user");
    order.address = address._id;
    console.log(order);
    return order.save();
  }

  /**
   * Update the cost of the order
   * @param orderId - The order Id
   * @param cost - The cost
   * @returns The updated order
   */
  async updateCost(orderId: string, cost: number, session: ClientSession) {
    return this.orderModel.findByIdAndUpdate(orderId, { $inc: { cost } }, { new: true, session });
  }

    /**
   * Update quantity of product in an order item.
   * @param orderItem - The order item document.
   * @param quantity - The quantity to update.
   * @returns The updated order item.
   */
  async updateItemQuantity(orderItem: OrderItemDocument, quantity: number) {
    if (![OrderStatus.PROCESSING, OrderStatus.PENDING].includes((orderItem.order as any).status)) throw new ForbiddenException("Cannot update order item quantity for order with status other than 'Processing' or 'Pending'");
    
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const oldCost = orderItem.cost;
      orderItem.quantity = quantity;
      orderItem.cost = (orderItem.product as any).price * quantity;
      await orderItem.save({ session });
      await this.updateCost(orderItem.order._id.toString(), orderItem.cost - oldCost, session);
      await session.commitTransaction();
      return orderItem;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * Remove the order
   * @param order - The order document
   * @returns void
   */
  async remove(order: OrderDocument) {
    await order.deleteOne();
  }

  /**
   * Remove order item by ID.
   * @param orderItemId - The order item ID.
   * @returns The removed order item.
   */
  async removeItem(orderItem: OrderItemDocument) {
    if (![OrderStatus.PROCESSING, OrderStatus.PENDING].includes((orderItem.order as any).status)) throw new ForbiddenException("Cannot remove order item for order with status other than 'Processing' or 'Pending'");
    
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      await this.updateCost(orderItem.order._id.toString(), -orderItem.cost, session);
      await orderItem.deleteOne({ session });
      await session.commitTransaction();
      return orderItem;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}