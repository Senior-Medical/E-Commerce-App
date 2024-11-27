import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { CartItem } from "./entities/cartItem.entity";
import { Document, Model, Types } from "mongoose";

@Injectable()
export class CartItemService {
  constructor(
    @InjectModel(CartItem.name) private cartItemModel: Model<CartItem>,
  ) { }
  
  find(user: Document) {
    return this.cartItemModel.find({user: user._id}).populate('product', 'name description price images code salesTimes');
  }

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

  async remove(product: Document, user: Document) {
    await this.cartItemModel.findOneAndDelete({ product: product._id, user: user._id });
  }
}