import { Injectable } from "@nestjs/common";
import { PermissionBaseGuard } from "src/utils/shared/guards/permission.guard";
import { OrdersService } from "../orders.service";

/**
 * Guard to check if the authenticated user has permission to access a specific order item.
 * - Ensures the order item exists.
 * - Validates that customers can only access their own orders items.
 */
@Injectable()
export class OrderItemPermissionGuard extends PermissionBaseGuard {
  constructor(private readonly ordersService: OrdersService) {
    super();
  }

  async findEntity(id: string): Promise<any> {
    return (await (await this.ordersService.findOneItem(id)).populate("product")).populate("order");
  }
  getEntityOwnerId(entity: any): string {
    return entity.order.user.toString();
  }
  getEntityKeyInRequest(): string {
    return OrdersService.getItemEntityName();
  }
}