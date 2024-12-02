import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { PaymentMethodsService } from "../paymentMethods.service";
import { Role } from "src/auth/enums/roles.enum";

/**
 * Guard to enforce access control for payment methods.
 * - Ensures the payment method exists.
 * - Restricts customers to access only their own payment methods.
 * - Allows admins and staff unrestricted access.
 */
@Injectable()
export class PaymentMethodPermissionGuard implements CanActivate {
  constructor(private paymentMethodsService: PaymentMethodsService) {}

  /**
   * Determines if the request should be allowed.
   * @param context - The execution context of the request
   * @returns `true` if the user is the owner, admin or staff, `false` otherwise
   * @throws NotFoundException if the payment method does not exist
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const user = context.switchToHttp().getRequest().user;
    const paymentMethodId = context.switchToHttp().getRequest().params.paymentMethodId;
    const paymentMethod = await this.paymentMethodsService.findOne(paymentMethodId);
    if (!paymentMethod) throw new NotFoundException("Payment Method not found");
    if(user.role === Role.customer && paymentMethod.user.toString() !== user._id.toString()) return false;
    return true;
  }
  
}