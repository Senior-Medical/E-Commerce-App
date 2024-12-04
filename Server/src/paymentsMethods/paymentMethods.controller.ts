import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Req,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { Request } from "express";
import { Query } from "mongoose";
import { UserDocument } from "src/users/entities/users.entity";
import { ApiFeatureInterceptor } from "src/utils/apiFeature/interceptors/apiFeature.interceptor";
import { CreatePaymentMethodsDto } from "./dtos/createPaymentMethods.dto";
import { UpdatePaymentMethodsDto } from "./dtos/updatePaymentMethods.dto";
import { PaymentMethods, PaymentMethodsDocument } from "./entities/paymentMethods.entitiy";
import { PaymentMethodPermissionGuard } from "./guard/paymentMethodPermission.guard";
import { PaymentMethodsService } from './paymentMethods.service';
import { GetObjectFromRequestDecorator } from "src/utils/shared/decorators/getObjectFromRequest.decorator";

/**
 * PaymentMethodsController
 *
 * Handles CRUD operations for payment methods, including:
 * - Retrieving a list of payment methods for the current user or a specific user.
 * - Adding new payment methods.
 * - Updating and deleting existing payment methods.
 * - Enforcing role-based and ownership-based access control.
 */
@Controller("payments")
export class PaymentMethodsController {
  constructor(private readonly paymentMethodsService: PaymentMethodsService) { }
  
  /**
   * Retrieves all payment methods.
   * - Customers see only their own payment methods.
   * - Admins and staff can access all payment methods.
   * @param user - The authenticated user object.
   * @returns List of payment methods.
   */
  @Get()
  @UseInterceptors(ApiFeatureInterceptor)
  find(@Req() req: Request & { queryBuilder: Query<PaymentMethods, PaymentMethodsDocument>, user: UserDocument }) {
    return this.paymentMethodsService.find(req).populate("user", "name username");
  }

  /**
   * Retrieves a single payment method by its ID.
   * - Ensures access permissions using `PaymentMethodPermissionGuard`.
   * - Populates associated user details.
   * @param paymentMethod - The validated and authorized payment method document.
   * @returns Payment method details.
   */
  @Get(`:${PaymentMethodsService.getEntityName()}Id`)
  @UseGuards(PaymentMethodPermissionGuard)
  findOne(@GetObjectFromRequestDecorator(PaymentMethodsService.getEntityName()) paymentMethod: PaymentMethodsDocument) {
    return paymentMethod.populate("user", "name username");
  }

  /**
   * Creates a new payment method for the authenticated user.
   * - Validates the input DTO.
   * - Associates the payment method with the current user.
   * @param paymentMethodData - DTO containing payment method details.
   * @param user - The authenticated user document.
   * @returns The created payment method.
   */
  @Post()
  create(
    @Body() paymentMethodData: CreatePaymentMethodsDto,
    @GetObjectFromRequestDecorator('user') user: UserDocument
  ) {
    return this.paymentMethodsService.create(paymentMethodData, user);
  }

  /**
   * Updates an existing payment method.
   * - Ensures access permissions using `PaymentMethodPermissionGuard`.
   * - Validates the input DTO and updates the payment method.
   * @param paymentMethod - The validated payment method document.
   * @param paymentMethodData - DTO containing updated payment method details.
   * @param user - The authenticated user document.
   * @returns The updated payment method.
   */
  @Patch(`:${PaymentMethodsService.getEntityName()}Id`)
  @HttpCode(HttpStatus.ACCEPTED)
  @UseGuards(PaymentMethodPermissionGuard)
  update(
    @GetObjectFromRequestDecorator(PaymentMethodsService.getEntityName()) paymentMethod: PaymentMethodsDocument,
    @Body() paymentMethodData: UpdatePaymentMethodsDto,
    @GetObjectFromRequestDecorator('user') user: UserDocument
  ) {
    return this.paymentMethodsService.update(paymentMethod, paymentMethodData, user);
  }

  /**
   * Deletes a payment method by its ID.
   * - Ensures access permissions using `PaymentMethodPermissionGuard`.
   * - Removes the payment method from the database.
   * @param paymentMethod - The validated payment method document.
   */
  @Delete(`:${PaymentMethodsService.getEntityName()}Id`)
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(PaymentMethodPermissionGuard)
  async remove(@GetObjectFromRequestDecorator(PaymentMethodsService.getEntityName()) paymentMethod: PaymentMethodsDocument) {
    await this.paymentMethodsService.remove(paymentMethod);
  }
}