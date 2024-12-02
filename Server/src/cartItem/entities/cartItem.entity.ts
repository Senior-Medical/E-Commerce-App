import {
  Prop,
  Schema,
  SchemaFactory
} from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

/**
 * Schema for the CartItem collection.
 * Represents a product added to a user's cart with quantity and cost details.
 */
@Schema({ timestamps: true })
export class CartItem {
  @Prop({
    required: true,
    ref: 'Product'
  })
  product: Types.ObjectId;

  @Prop({
    required: true,
    ref: 'User'
  })
  user: Types.ObjectId;

  @Prop({
    required: true
  })
  quantity: number;

  @Prop({
    required: true
  })
  cost: number;
}

const CartItemSchema = SchemaFactory.createForClass(CartItem);
CartItemSchema.index({ user: 1, product: 1 }, { unique: true });
export { CartItemSchema };

export type CartItemDocument = Document & CartItem;