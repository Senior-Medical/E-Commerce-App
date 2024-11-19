import { ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

export function luhnCheck(cardNumber: string): boolean {
  let sum = 0;
  let shouldDouble = false;
  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNumber[i]);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

@ValidatorConstraint({ name: 'LuhnValidation', async: true })
export class LuhnValidationConstraint implements ValidatorConstraintInterface {  
  async validate(cardNumber: string): Promise<boolean> {
    return luhnCheck(cardNumber);
  }

  defaultMessage(): string {
    return 'Invalid card number.';
  }
}