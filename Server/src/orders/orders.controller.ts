import {
  Body,
  Controller,
  Post,
  UseGuards
} from "@nestjs/common";
import { OrdersService } from './orders.service';
import { UserDecorator } from "src/users/decorators/user.decorator";
import { AddressDocument } from "src/addresses/entities/addresses.entity";
import { ObjectIdPipe } from "src/utils/shared/pipes/ObjectIdValidation.pipe";
import { AddressIdPipe } from "src/addresses/pipes/addressIdValidation.pipe";
import { UserDocument } from "src/users/entities/users.entity";
import { CreateOrderGuard } from "./guards/createOrder.guard";

/**
 * Controller for managing orders operations
 */
@Controller("orders")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  /**
   * Create a new order
   * @param user - The user document
   * @param address - The address document
   * @returns The created order
   */
  @Post()
  @UseGuards(CreateOrderGuard)
  create(
    @UserDecorator() user: UserDocument,
    @Body("addressId", ObjectIdPipe, AddressIdPipe) address: AddressDocument
  ) {
    return this.ordersService.create(user, address);
  }
}