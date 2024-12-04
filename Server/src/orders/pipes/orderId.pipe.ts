import {
  ArgumentMetadata,
  Injectable,
  NotFoundException,
  PipeTransform
} from "@nestjs/common";
import { OrdersService } from '../orders.service';

/**
 * Validates a order ID and resolves it to the corresponding order document.
 * Throws an exception if the order is not found.
 */
@Injectable()
export class OrderIdPipe implements PipeTransform {
  constructor(private readonly ordersService: OrdersService) { }
  
  async transform(orderId: string, metadata: ArgumentMetadata) {
    const order = await this.ordersService.findOne(orderId);
    if (!order) throw new NotFoundException("Order not found.");
    return order;
  }
}