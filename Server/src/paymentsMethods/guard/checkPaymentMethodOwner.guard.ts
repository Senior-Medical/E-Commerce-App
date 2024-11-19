import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { PaymentMethodsService } from "../paymentMethods.service";

@Injectable()
export class CheckPaymentMethodOwnerGuard implements CanActivate {
  constructor(private paymentMethodsService: PaymentMethodsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const user = context.switchToHttp().getRequest().user;
    const paymentMethodId = context.switchToHttp().getRequest().params.paymentMethodId;
    const paymentMethod = await this.paymentMethodsService.findOne(paymentMethodId);

    return paymentMethod.user.toString() === user._id.toString();
  }
  
}