import {
  ArgumentMetadata,
  Injectable,
  NotFoundException,
  PipeTransform
} from "@nestjs/common";
import { PaymentMethodsService } from '../paymentMethods.service';

/**
 * Pipe to validate and transform a payment method ID.
 * - Ensures the provided ID corresponds to an existing payment method.
 * - Throws a `NotFoundException` if the ID is invalid.
 * - Transforms the ID into the corresponding payment method document.
 */
@Injectable()
export class PaymentMethodIdValidationPipe implements PipeTransform {
  constructor(private readonly paymentMethodsService: PaymentMethodsService) { }
  
  /**
   * Transforms the provided `id` into an payment method document.
   * @param id - The ID of the payment method to validate
   * @param metadata - Metadata about the argument being transformed
   * @returns The payment method document if validation succeeds
   * @throws NotFoundException if the address does not exist
   */
  async transform(id: string, metadata: ArgumentMetadata) {
    const paymentMethod = await this.paymentMethodsService.findOne(id);
    if (!paymentMethod) throw new NotFoundException("Invalid id.");
    return paymentMethod;
  }
}