import { ArgumentMetadata, Injectable, NotAcceptableException, PipeTransform } from "@nestjs/common";
import { PaymentMethodsService } from '../paymentMethods.service';

@Injectable()
export class PaymentMethodIdValidationPipe implements PipeTransform {
  constructor(private readonly paymentMethodsService: PaymentMethodsService) { }
  
  async transform(id: any, metadata: ArgumentMetadata) {
    const paymentMethod = await this.paymentMethodsService.findOne(id);
    if (!paymentMethod) throw new NotAcceptableException("Invalid id.");
    return paymentMethod;
  }
}