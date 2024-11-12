import { Types } from "mongoose";

export type CreateCategory = {
  name: string;
  description?: string;
  createdBy: Types.ObjectId;
  updatedBy: Types.ObjectId;
}