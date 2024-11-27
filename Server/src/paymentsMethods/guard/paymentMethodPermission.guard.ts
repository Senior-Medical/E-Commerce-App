import { CanActivate, ExecutionContext, Injectable, NotFoundException } from "@nestjs/common";
import { PaymentMethodsService } from "../paymentMethods.service";
import { Role } from "src/auth/enums/roles.enum";

@Injectable()
export class PaymentMethodPermissionGuard implements CanActivate {
  constructor(private paymentMethodsService: PaymentMethodsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const user = context.switchToHttp().getRequest().user;
    const paymentMethodId = context.switchToHttp().getRequest().params.paymentMethodId;
    const paymentMethod = await this.paymentMethodsService.findOne(paymentMethodId);
    if (!paymentMethod) throw new NotFoundException("Payment Method not found");
    if(user.role === Role.customer && paymentMethod.user.toString() !== user._id.toString()) return false;
    return true;
  }
  
}