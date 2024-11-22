import { Types } from "mongoose";
import { CodePurpose, CodeType } from "../enums/codePurpose.enum";

export type CreateCode = {
  code: string;
  value: string;
  type: CodeType;
  purpose: CodePurpose;
  user: Types.ObjectId;
};