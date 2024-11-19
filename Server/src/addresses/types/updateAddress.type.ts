import { CreateAddressType } from "./createAddress.type";

export type UpdateAddressType = Partial<Omit<CreateAddressType, "user">>;