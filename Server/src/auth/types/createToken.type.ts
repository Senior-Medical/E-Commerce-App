import { Types } from "mongoose";

export type CreateRefreshToken = {
  token: string;
  user: Types.ObjectId;
};