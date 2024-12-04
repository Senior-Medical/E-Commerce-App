import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotAcceptableException,
  NotFoundException
} from "@nestjs/common";
import { Role } from "src/auth/enums/roles.enum";
import { OrdersService } from '../orders.service';
import { Types } from "mongoose";

/**
 * Guard to check if the authenticated user has permission to access a specific order.
 * - Ensures the order exists.
 * - Validates that customers can only access their own orders.
 */
@Injectable()
export class OrderPermissionGuard implements CanActivate {
  constructor(private readonly ordersService: OrdersService) { }

  /**
   * Determines if the request should be allowed.
   * @param context - The execution context of the request
   * @returns `true` if the user is the owner, admin or staff, `false` otherwise
   * @throws NotFoundException if the order does not exist
   */
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const { orderId } = request.params;
    const user = request.user;

    if (!Types.ObjectId.isValid(orderId)) throw new NotAcceptableException("Invalid Mongo Id");

    const order = await this.ordersService.findOne(orderId);
    if (!order) throw new NotFoundException("Order not found");
    
    if (user.role === Role.customer && order.user.toString() !== user._id.toString()) return false;
    request.order = order;
    return true;
  }
}