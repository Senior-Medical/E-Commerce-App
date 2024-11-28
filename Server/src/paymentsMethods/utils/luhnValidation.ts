import { ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

/**
 * Utility function implementing the Luhn algorithm to validate card numbers.
 * 
 * - Iterates through the card number digits from right to left.
 * - Doubles every second digit and subtracts 9 if the result exceeds 9.
 * - Calculates a checksum and validates it by checking if divisible by 10.
 * 
 * @param cardNumber - Card number to validate as a string.
 * @returns `true` if the card number is valid, otherwise `false`.
 */
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

/**
 * Validator constraint for the Luhn algorithm used in class-validator decorators.
 * 
 * - Ensures asynchronous validation for card numbers in DTOs.
 * - Relies on the `luhnCheck` utility function for logic.
 * - Provides a default error message for invalid card numbers.
 */
@ValidatorConstraint({ name: 'LuhnValidation', async: true })
export class LuhnValidationConstraint implements ValidatorConstraintInterface {  
  async validate(cardNumber: string): Promise<boolean> {
    return luhnCheck(cardNumber);
  }

  defaultMessage(): string {
    return 'Invalid card number.';
  }
}