import { Types } from "mongoose";

export type CreatePaymentMethods = {
  cardType: string;
  cardNumber: string;
  cardholderName: string;
  expiryDate: string;
  isDefault?: boolean;
  user: Types.ObjectId
};