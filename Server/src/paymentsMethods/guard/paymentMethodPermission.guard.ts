import { Injectable } from "@nestjs/common";
import { PaymentMethodsService } from "../paymentMethods.service";
import { PermissionBaseGuard } from "src/utils/shared/guards/permission.guard";

/**
 * Guard to enforce access control for payment methods.
 * - Ensures the payment method exists.
 * - Restricts customers to access only their own payment methods.
 * - Allows admins and staff unrestricted access.
 */
@Injectable()
export class PaymentMethodPermissionGuard extends PermissionBaseGuard {
  constructor(private paymentMethodsService: PaymentMethodsService) {
    super();
  }

  findEntity(id: string): Promise<any> {
    return this.paymentMethodsService.findOne(id);
  }

  getEntityOwnerId(entity: any): string {
    return entity.user.toString();
  }

  getEntityKeyInRequest(): string {
    return PaymentMethodsService.getEntityName();
  }
}