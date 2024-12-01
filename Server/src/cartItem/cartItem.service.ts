import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { CartItem } from "./entities/cartItem.entity";
import { Document, Model, Types } from "mongoose";

/**
 * Service for managing cart item operations.
 */
@Injectable()
export class CartItemService {
  constructor(
    @InjectModel(CartItem.name) private cartItemModel: Model<CartItem>,
  ) { }

  /**
   * Get model of this service to use it in api feature module
   * @returns - The wish list model
   */
  getModel() {
    return this.cartItemModel;
  }

  /**
   * Get available keys in the entity that may need in search.
   * @returns - Array of strings that contain keys names
   */
  getSearchKeys() {
    return [
      "quantity",
      "cost"
    ];
  }
  
  /**
   * Retrieves all cart items for a user.
   * @param user - The user document.
   * @returns List of cart items with populated product details.
   */
  find(req: any) {
    const user = req.user;
    const queryBuilder = req.queryBuilder;
    return queryBuilder.find({ user: user._id }).select("-__v").populate("product", "name price images description code salesTimes");
  }

  /**
   * Adds a product to the user's cart.
   * Calculates and updates the user's cart total.
   * @param product - The product document.
   * @param quantity - The quantity of the product.
   * @param user - The user document.
   * @returns The created cart item.
   */
  async create(product: any, quantity: number, user: any) {
    const cost = quantity * product.price;
    const inputData: CartItem = {
      product: product._id,
      user: user._id,
      quantity,
      cost
    };
    const cartItem = await this.cartItemModel.create(inputData);
    user.cartTotal += cost;
    await user.save();
    return cartItem;
  }

  /**
   * Updates the quantity of a product in the user's cart.
   * Recalculates and updates the user's cart total.
   * @param product - The product document.
   * @param quantity - The new quantity.
   * @param user - The user document.
   * @returns The updated cart item.
   * @throws NotFoundException if the cart item does not exist.
   */
  async update(product: any, quantity: number, user: any) {
    const cartItem = await this.cartItemModel.findOne({ product: product._id, user: user._id });
    if (!cartItem) throw new NotFoundException('CartItem not exist.');

    const oldCost = cartItem.cost;
    cartItem.quantity = quantity;
    cartItem.cost = quantity * product.price;

    user.cartTotal += cartItem.cost - oldCost;
    await user.save();
    return cartItem.save();
  }

  /**
   * Removes a product from the user's cart.
   * Updates the user's cart total.
   * @param product - The product document.
   * @param user - The user document.
   */
  async remove(product: Document, user: Document) {
    await this.cartItemModel.findOneAndDelete({ product: product._id, user: user._id });
  }
}