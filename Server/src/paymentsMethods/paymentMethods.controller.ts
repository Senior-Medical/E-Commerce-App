import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { PaymentMethodsService } from './paymentMethods.service';
import { UserDecorator } from "src/common/decorators/user.decorator";
import { Document } from "mongoose";
import { ObjectIdPipe } from "src/common/pipes/ObjectIdValidation.pipe";
import { PaymentMethodIdValidationPipe } from './pipes/paymentMethodIdValidation.pipe';
import { CreatePaymentMethodsDto } from "./dtos/createPaymentMethods.dto";
import { UpdatePaymentMethodsDto } from "./dtos/updatePaymentMethods.dto";
import { CheckPaymentMethodOwnerGuard } from "./guard/checkPaymentMethodOwner.guard";

@Controller("payments")
export class PaymentMethodsController {
  constructor(private readonly paymentMethodsService: PaymentMethodsService) { }
  
  @Get()
  find(@UserDecorator() user: Document) {
    return this.paymentMethodsService.find({user: user._id});
  }

  @Get(":paymentMethodId")
  findOne(@Param("paymentMethodId", ObjectIdPipe, PaymentMethodIdValidationPipe) paymentMethod: Document) {
    return paymentMethod;
  }

  @Post()
  create(@Body() paymentMethodData: CreatePaymentMethodsDto, @UserDecorator() user: Document) {
    return this.paymentMethodsService.create(paymentMethodData, user);
  }

  @Patch(":paymentMethodId")
  @HttpCode(HttpStatus.ACCEPTED)
  @UseGuards(CheckPaymentMethodOwnerGuard)
  update(@Param("paymentMethodId", ObjectIdPipe, PaymentMethodIdValidationPipe) paymentMethod: Document, @Body() paymentMethodData: UpdatePaymentMethodsDto, @UserDecorator() user: Document) {
    return this.paymentMethodsService.update(paymentMethod, paymentMethodData, user);
  }

  @Delete(":paymentMethodId")
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(CheckPaymentMethodOwnerGuard)
  remove(@Param("paymentMethodId", ObjectIdPipe, PaymentMethodIdValidationPipe) paymentMethod: Document) {
    this.paymentMethodsService.remove(paymentMethod);
  }
}