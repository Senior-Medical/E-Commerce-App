import { Types } from "mongoose";

export type CreateAddressType = {
  title: string,
  addressLine: string,
  country: string,
  city: string,
  state: string,
  postalCode: string,
  landmark?: string,
  user: Types.ObjectId
};