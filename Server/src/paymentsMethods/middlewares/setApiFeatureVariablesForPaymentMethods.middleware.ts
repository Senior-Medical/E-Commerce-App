import { Injectable } from '@nestjs/common';
import { PaymentMethodsService } from '../paymentMethods.service';

@Injectable()
export class SetApiFeatureVariableForPaymentMethods {
  constructor(private readonly paymentMethodsService: PaymentMethodsService) {}

  use(req: any, res: any, next: () => void) {
    req.apiFeature = {
      model: this.paymentMethodsService.getModel(),
      searchArray: this.paymentMethodsService.getSearchKeys()
    }
    next();
  }
}
