import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

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

export const CartItemSchema = SchemaFactory.createForClass(CartItem);