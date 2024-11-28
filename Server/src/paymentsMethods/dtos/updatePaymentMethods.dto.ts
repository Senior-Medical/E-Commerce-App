import { PartialType } from "@nestjs/mapped-types";
import { CreatePaymentMethodsDto } from "./createPaymentMethods.dto";

/**
 * DTO for updating payment methods.
 * - Extends the creation DTO to allow partial updates of payment method data.
 */
export class UpdatePaymentMethodsDto extends PartialType(CreatePaymentMethodsDto) { }