import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
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
import { CreateOrderReviewDto } from './dto/createOrderReview.dto';
import { UpdateOrderReviewDto } from './dto/updateOrderReview.dto';
import { OrderItemPermissionGuard } from "./guards/orderItemPermission.guard";
import { OrderItemDocument } from "./entities/orderItem.entity";

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
   * Retrieves order items by order ID.
   * @param order - The order document.
   * @returns The order document.
   */
  @Get(`items/:${OrdersService.getEntityName()}Id`)
  @UseGuards(OrderPermissionGuard)
  findItems(@GetObjectFromRequestDecorator(OrdersService.getEntityName()) order: OrderDocument) {
    return this.ordersService.findItems(order._id);
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
   * Create Review for the order by ID
   * @param order - The order document
   * @param createOrderReviewDto - The review data
   * @returns The updated order
   */
  @Post(`review/:${OrdersService.getEntityName()}Id`)
  @UseGuards(OrderPermissionGuard)
  createReview(
    @GetObjectFromRequestDecorator(OrdersService.getEntityName()) order: OrderDocument,
    @Body() createOrderReviewDto: CreateOrderReviewDto
  ) {
    return this.ordersService.createReview(order, createOrderReviewDto);
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
   * Updates order items by order item ID.
   * @param orderItem - The order Item document.
   * @returns The updated order Item document.
   */
  @Patch(`items/:${OrdersService.getItemEntityName()}Id`)
  @UseGuards(OrderItemPermissionGuard)
  updateItemQuantity(
    @GetObjectFromRequestDecorator(OrdersService.getItemEntityName()) orderItem: OrderItemDocument,
    @Body('quantity', ParseIntPipe) quantity: number
  ) {
    return this.ordersService.updateItemQuantity(orderItem, quantity);
  }

  /**
   * Update review for the order by order ID
   * @param order - The order document
   * @param updateOrderReviewDto - The review data
   * @returns The updated order
   */
  @Patch(`review/:${OrdersService.getEntityName()}Id`)
  @HttpCode(HttpStatus.ACCEPTED)
  @UseGuards(OrderPermissionGuard)
  updateReview(
    @GetObjectFromRequestDecorator(OrdersService.getEntityName()) order: OrderDocument,
    @Body() updateOrderReviewDto: UpdateOrderReviewDto
  ) {
    return this.ordersService.updateReview(order, updateOrderReviewDto);
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

  /**
   * Remove order items by order item ID.
   * @param orderItem - The order Item document.
   */
  @Delete(`items/:${OrdersService.getItemEntityName()}Id`)
  @UseGuards(OrderItemPermissionGuard)
  async removeItem(@GetObjectFromRequestDecorator(OrdersService.getItemEntityName()) orderItem: OrderItemDocument) {
    await this.ordersService.removeItem(orderItem);
  }

  /**
   * Remove the review of the order by ID
   * @param order - The order document
   * @returns void
   */
  @Delete(`review/:${OrdersService.getEntityName()}Id`)
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(OrderPermissionGuard)
  async removeReview(@GetObjectFromRequestDecorator(OrdersService.getEntityName()) order: OrderDocument) {
    await this.ordersService.removeReview(order);
  }
}