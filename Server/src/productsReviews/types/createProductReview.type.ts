import { Types } from "mongoose";

export type CreateProductReview = {
  comment: string;
  rate: number;
  product: Types.ObjectId;
  user: Types.ObjectId;
}