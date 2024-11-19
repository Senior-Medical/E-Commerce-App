import { IsBoolean, IsNotEmpty, IsOptional, IsString, Matches, Validate } from "class-validator";
import { LuhnValidationConstraint } from "../utils/luhnValidation";

export class CreatePaymentMethodsDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^(Visa|MasterCard|American Express|Discover)$/, {
    message: 'Card type must be Visa, MasterCard, American Express, or Discover',
  })
  cardType: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9]{13,19}$/, { message: 'Card number must be between 13 and 19 digits' })
  @Validate(LuhnValidationConstraint)
  cardNumber: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z\s-]+$/, { message: 'Cardholder name must only contain letters, spaces, and hyphens' })
  cardholderName: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^(0[1-9]|1[0-2])\/\d{2}$/, { message: 'Expiry date must be in MM/YY format' })
  expiryDate: string;

  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;
}