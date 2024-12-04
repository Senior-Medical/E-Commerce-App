import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { Query } from "mongoose";
import { AddressDocument } from "src/addresses/entities/addresses.entity";
import { AddressIdPipe } from "src/addresses/pipes/addressIdValidation.pipe";
import { Roles } from "src/auth/decorators/roles.decorator";
import { Role } from "src/auth/enums/roles.enum";
import { UserDocument } from "src/users/entities/users.entity";
import { ApiFeatureInterceptor } from "src/utils/apiFeature/interceptors/apiFeature.interceptor";
import { ObjectIdPipe } from "src/utils/shared/pipes/ObjectIdValidation.pipe";
import { Order, OrderDocument } from "./entities/orders.entity";
import { CreateOrderGuard } from "./guards/createOrder.guard";
import { OrderPermissionGuard } from "./guards/orderPermission.guard";
import { OrdersService } from './orders.service';
import { OrderIdPipe } from "./pipes/orderId.pipe";
import { GetObjectFromRequestDecorator } from "src/utils/shared/decorators/getObjectFromRequest.decorator";

/**
 * Controller for managing orders operations
 */
@Controller("orders")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  /**
   * Retrieves orders based on specified query parameter.
   * @param req - Request object containing the query builder and user.
   * @returns A list of orders.
  */
  @Get()
  @UseInterceptors(ApiFeatureInterceptor)
  find(@Req() req: Request & { user: UserDocument, queryBuilder: Query<Order, OrderDocument> }) {
    return this.ordersService.find(req).populate("address", "-__v -createdAt -updatedAt");
  }

  /**
   * Retrieves a order by ID.
   * @param order - The order document.
   * @returns The order document.
   */
  @Get(`:${OrdersService.getEntityName()}Id`)
  @UseGuards(OrderPermissionGuard)
  findOne(@GetObjectFromRequestDecorator(OrdersService.getEntityName()) order: OrderDocument) {
    return order.populate("address", "-__v -createdAt -updatedAt");
  }

  /**
   * Create a new order
   * @param user - The user document
   * @param address - The address document
   * @returns The created order
   */
  @Post()
  @UseGuards(CreateOrderGuard)
  create(
    @GetObjectFromRequestDecorator('user') user: UserDocument,
    @Body("address", ObjectIdPipe, AddressIdPipe) address: AddressDocument
  ) {
    return this.ordersService.create(user, address);
  }

  /**
   * Update status of the order by ID
   * @param order - The order document
   * @returns The updated order
   */
  @Patch(`status/:${OrdersService.getEntityName()}Id`)
  @HttpCode(HttpStatus.ACCEPTED)
  @Roles(Role.admin, Role.staff)
  updateStatus(@Param(`${OrdersService.getEntityName()}Id`, ObjectIdPipe, OrderIdPipe) order: OrderDocument) {
    return this.ordersService.updateStatus(order);
  }

  /**
   * Cancel the order by ID
   * @param order - The order document
   * @returns The updated order
   */
  @Patch(`cancel/:${OrdersService.getEntityName()}Id`)
  @HttpCode(HttpStatus.ACCEPTED)
  @UseGuards(OrderPermissionGuard)
  cancelOrder(@GetObjectFromRequestDecorator(OrdersService.getEntityName()) order: OrderDocument) {
    return this.ordersService.cancelOrder(order);
  }

  /**
   * Update the address of the order by ID
   * @param order - The order document
   * @param address - The address document
   * @returns The updated order
   */
  @Patch(`address/:${OrdersService.getEntityName()}Id`)
  @HttpCode(HttpStatus.ACCEPTED)
  @UseGuards(OrderPermissionGuard)
  updateAddress(
    @GetObjectFromRequestDecorator(OrdersService.getEntityName()) order: OrderDocument,
    @Body(`address`, ObjectIdPipe, AddressIdPipe) address: AddressDocument,
  ) {
    return this.ordersService.updateAddress(order, address);
  }

  /**
   * Remove the order by ID
   * @param order - The order document
   * @returns void
   */
  @Delete(`:${OrdersService.getEntityName()}Id`)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(Role.admin, Role.staff)
  remove(@Param(`${OrdersService.getEntityName()}Id`, ObjectIdPipe, OrderIdPipe) order: OrderDocument) {
    return this.ordersService.remove(order);
  }
}