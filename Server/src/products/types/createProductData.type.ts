import { Types } from "mongoose";

export type CreateProduct = {
  name: string;
  description?: string;
  images: string[];
  code: string;
  price: number;
  category: Types.ObjectId;
  createdBy: Types.ObjectId;
  updatedBy: Types.ObjectId;
}
