import { PartialType } from "@nestjs/mapped-types";
import { CreatePaymentMethodsDto } from "./createPaymentMethods.dto";

export class UpdatePaymentMethodsDto extends PartialType(CreatePaymentMethodsDto) { }