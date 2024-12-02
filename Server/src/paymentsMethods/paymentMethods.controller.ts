import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Req, UseGuards, UseInterceptors } from "@nestjs/common";
import { Request } from "express";
import { Document, Query } from "mongoose";
import { UserDecorator } from "src/users/decorators/user.decorator";
import { User } from "src/users/entities/users.entity";
import { ApiFeatureInterceptor } from "src/utils/apiFeature/interceptors/apiFeature.interceptor";
import { ObjectIdPipe } from "src/utils/shared/pipes/ObjectIdValidation.pipe";
import { CreatePaymentMethodsDto } from "./dtos/createPaymentMethods.dto";
import { UpdatePaymentMethodsDto } from "./dtos/updatePaymentMethods.dto";
import { PaymentMethods } from "./entities/paymentMethods.entitiy";
import { PaymentMethodPermissionGuard } from "./guard/paymentMethodPermission.guard";
import { PaymentMethodsService } from './paymentMethods.service';
import { PaymentMethodIdValidationPipe } from './pipes/paymentMethodIdValidation.pipe';

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
  find(@Req() req: Request & { queryBuilder: Query<PaymentMethods, Document>, user: Document & User }) {
    return this.paymentMethodsService.find(req).populate("user", "name username");
  }

  /**
   * Retrieves a single payment method by its ID.
   * - Ensures access permissions using `PaymentMethodPermissionGuard`.
   * - Populates associated user details.
   * @param paymentMethod - The validated and authorized payment method document.
   * @returns Payment method details.
   */
  @Get(":paymentMethodId")
  @UseGuards(PaymentMethodPermissionGuard)
  findOne(@Param("paymentMethodId", ObjectIdPipe, PaymentMethodIdValidationPipe) paymentMethod: Document) {
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
  create(@Body() paymentMethodData: CreatePaymentMethodsDto, @UserDecorator() user: Document) {
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
  @Patch(":paymentMethodId")
  @HttpCode(HttpStatus.ACCEPTED)
  @UseGuards(PaymentMethodPermissionGuard)
  update(@Param("paymentMethodId", ObjectIdPipe, PaymentMethodIdValidationPipe) paymentMethod: Document, @Body() paymentMethodData: UpdatePaymentMethodsDto, @UserDecorator() user: Document) {
    return this.paymentMethodsService.update(paymentMethod, paymentMethodData, user);
  }

  /**
   * Deletes a payment method by its ID.
   * - Ensures access permissions using `PaymentMethodPermissionGuard`.
   * - Removes the payment method from the database.
   * @param paymentMethod - The validated payment method document.
   */
  @Delete(":paymentMethodId")
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(PaymentMethodPermissionGuard)
  async remove(@Param("paymentMethodId", ObjectIdPipe, PaymentMethodIdValidationPipe) paymentMethod: Document) {
    await this.paymentMethodsService.remove(paymentMethod);
  }
}