import {
  Prop,
  Schema,
  SchemaFactory
} from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

/**
 * Schema for the WishList collection.
 * Links a user to a product with unique user-product pairs.
 */
@Schema({timestamps: true})
export class WishList {
  @Prop({
    required: true,
    ref: "User"
  })
  user: Types.ObjectId;

  @Prop({
    required: true,
    ref: "Product"
  })
  product: Types.ObjectId;
}

const WishListSchema = SchemaFactory.createForClass(WishList);
WishListSchema.index({ user: 1, product: 1 }, { unique: true });

export { WishListSchema };

export type WishListDocument = Document<Types.ObjectId> & WishList;