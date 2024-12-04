import { Injectable } from "@nestjs/common";
import { OrdersService } from '../orders.service';
import { PermissionBaseGuard } from "src/utils/shared/guards/permission.guard";

/**
 * Guard to check if the authenticated user has permission to access a specific order.
 * - Ensures the order exists.
 * - Validates that customers can only access their own orders.
 */
@Injectable()
export class OrderPermissionGuard extends PermissionBaseGuard {
  constructor(private readonly ordersService: OrdersService) {
    super();
  }

  findEntity(id: string): Promise<any> {
    return this.ordersService.findOne(id);
  }
  getEntityOwnerId(entity: any): string {
    return entity.user.toString();
  }
  getEntityKeyInRequest(): string {
    return OrdersService.getEntityName();
  }
}