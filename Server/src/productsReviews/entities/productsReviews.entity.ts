import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema()
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