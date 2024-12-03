import {
  Prop,
  Schema,
  SchemaFactory
} from "@nestjs/mongoose";
import { OrderStatus } from "../enums/orderStatus.enum";
import { Document, Types } from "mongoose";

/**
 * Order entity.
 */
@Schema()
export class Order {
  @Prop({
    required: true,
  })
  cost: number;

  @Prop({
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status?: OrderStatus;

  @Prop({
    ref: 'User',
    required: true,
  })
  user: Types.ObjectId;

  @Prop({
    ref: 'Address',
    required: true,
  })
  address: Types.ObjectId;
}

/**
 * Order schema.
 */
export const OrderSchema = SchemaFactory.createForClass(Order);

export type OrderDocument = Document<Types.ObjectId> & Order;