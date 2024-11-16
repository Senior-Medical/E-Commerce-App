import { Types } from "mongoose";
import { CreateProduct } from "./createProductData.type";

export type UpdateProduct = Partial<Omit<CreateProduct, 'updatedBy' | 'createdBy'>> & {
  updatedBy: Types.ObjectId;
};