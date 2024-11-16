import { Types } from "mongoose";
import { CreateCategory } from "./createCategoryData.type";

export type UpdateCategory = Partial<Omit<CreateCategory, "updatedBy" | "createdBy">> & {
  updatedBy: Types.ObjectId;
};