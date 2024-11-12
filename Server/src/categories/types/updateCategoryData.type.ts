import { Types } from "mongoose";

export type UpdateCategory = {
  name?: string;
  description?: string;
  createdBy?: Types.ObjectId;
  updatedBy: Types.ObjectId;
}