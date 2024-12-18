import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { ProductDocument } from "src/products/entities/products.entity";
import { OrderDocument } from "./orders.entity";

/**
 * Order item entity.
 */
@Schema()
export class OrderItem {
  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  cost: number;

  @Prop({
    required: true,
    ref: 'Product'
  })
  product: Types.ObjectId;

  @Prop({
    required: true,
    ref: 'Order'
  })
  order: Types.ObjectId;
}

/**
 * Order item schema.
 */
const OrderItemSchema = SchemaFactory.createForClass(OrderItem);
OrderItemSchema.index({ product: 1, order: 1 }, { unique: true });
export { OrderItemSchema };
export type OrderItemDocument = OrderItem & Document;