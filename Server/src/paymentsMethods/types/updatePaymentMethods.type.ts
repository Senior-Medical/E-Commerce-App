import { CreatePaymentMethods } from "./createPaymentMethods.type";

export type UpdatePaymentMethods = Partial<Omit<CreatePaymentMethods, "user">>;