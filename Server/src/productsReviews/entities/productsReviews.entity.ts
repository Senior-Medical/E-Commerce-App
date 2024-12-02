import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

/**
 * Schema definition for the product reviews collection. It includes the
 * review comment, rating, and references to the associated product and user.
 */
@Schema({timestamps: true})
export class ProductsReviews {
  @Prop()
  comment: string;

  @Prop({
    required: true,
    max: 5
  })
  rate: number;

  @Prop({
    required: true,
    ref: "Product"
  })
  product: Types.ObjectId;

  @Prop({
    required: true,
    ref: "User"
  })
  user: Types.ObjectId;
}

export const ProductsReviewsSchema = SchemaFactory.createForClass(ProductsReviews);

export type ProductsReviewsDocument = Document & ProductsReviews;