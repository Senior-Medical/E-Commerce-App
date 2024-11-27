import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { Document } from "mongoose";
import { ObjectIdPipe } from "src/common/pipes/ObjectIdValidation.pipe";
import { UserDecorator } from "src/users/decorators/user.decorator";
import { CreatePaymentMethodsDto } from "./dtos/createPaymentMethods.dto";
import { UpdatePaymentMethodsDto } from "./dtos/updatePaymentMethods.dto";
import { PaymentMethodPermissionGuard } from "./guard/paymentMethodPermission.guard";
import { PaymentMethodsService } from './paymentMethods.service';
import { PaymentMethodIdValidationPipe } from './pipes/paymentMethodIdValidation.pipe';
import { Roles } from "src/auth/decorators/roles.decorator";
import { Role } from "src/auth/enums/roles.enum";
import { UserIdValidationPipe } from "src/users/pipes/userIdValidation.pipe";

@Controller("payments")
export class PaymentMethodsController {
  constructor(private readonly paymentMethodsService: PaymentMethodsService) { }
  
  @Get()
  find(@UserDecorator() user: any) {
    let conditions = {};
    if (user.role === Role.customer) conditions = { user: user._id };
    return this.paymentMethodsService.find(conditions).populate("user", "name username");
  }

  @Get(":paymentMethodId")
  @UseGuards(PaymentMethodPermissionGuard)
  findOne(@Param("paymentMethodId", ObjectIdPipe, PaymentMethodIdValidationPipe) paymentMethod: Document) {
    return paymentMethod.populate("user", "name username");
  }

  @Get("user/:userId")
  @Roles(Role.admin, Role.staff)
  findByUser(@Param("userId", ObjectIdPipe, UserIdValidationPipe) user: Document) {
    return this.paymentMethodsService.find({user: user._id});
  }

  @Post()
  create(@Body() paymentMethodData: CreatePaymentMethodsDto, @UserDecorator() user: Document) {
    return this.paymentMethodsService.create(paymentMethodData, user);
  }

  @Patch(":paymentMethodId")
  @HttpCode(HttpStatus.ACCEPTED)
  @UseGuards(PaymentMethodPermissionGuard)
  update(@Param("paymentMethodId", ObjectIdPipe, PaymentMethodIdValidationPipe) paymentMethod: Document, @Body() paymentMethodData: UpdatePaymentMethodsDto, @UserDecorator() user: Document) {
    return this.paymentMethodsService.update(paymentMethod, paymentMethodData, user);
  }

  @Delete(":paymentMethodId")
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(PaymentMethodPermissionGuard)
  async remove(@Param("paymentMethodId", ObjectIdPipe, PaymentMethodIdValidationPipe) paymentMethod: Document) {
    await this.paymentMethodsService.remove(paymentMethod);
  }
}