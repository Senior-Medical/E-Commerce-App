import {
  Prop,
  Schema,
  SchemaFactory
} from "@nestjs/mongoose";
import { OrderStatus } from "../enums/orderStatus.enum";
import { Document, Types } from "mongoose";

/**
 * Schema definition for the order reviews collection. It includes the review rate and comment.
 */
class OrderReview {
  @Prop()
  comment: string;

  @Prop({
    required: true,
    max: 5,
    min: 0
  })
  rate: number;
}

/**
 * Schema definition for the orders collection. It includes the order cost,
 * status, review, and references to the associated user and address.
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
    type: OrderReview,
    _id: false
  })
  review?: OrderReview;

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