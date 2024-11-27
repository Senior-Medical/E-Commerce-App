import { Types } from "mongoose";

export type AddProductType = {
  productId: Types.ObjectId;
  userId: Types.ObjectId;
};