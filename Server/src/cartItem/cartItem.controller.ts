import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post } from "@nestjs/common";
import { CartItemService } from './cartItem.service';
import { UserDecorator } from "src/users/decorators/user.decorator";
import { Document } from "mongoose";
import { ObjectIdPipe } from "src/common/pipes/ObjectIdValidation.pipe";
import { ProductIdPipe } from "src/products/pipes/productIdValidation.pipe";

@Controller("cartItem")
export class CartItemController {
  constructor(private readonly cartItemService: CartItemService) { }
  
  @Get()
  find(@UserDecorator() user: Document) {
    return this.cartItemService.find(user);
  }

  @Post(":productId") 
  create(@Param('productId', ObjectIdPipe, ProductIdPipe) product: Document, @Body("quantity", ParseIntPipe) quantity: number, @UserDecorator() user: Document) {
    return this.cartItemService.create(product, quantity, user);
  }

  @Patch(":productId")
  @HttpCode(HttpStatus.ACCEPTED)
  update(@Param('productId', ObjectIdPipe, ProductIdPipe) product: Document, @Body("quantity", ParseIntPipe) quantity: number, @UserDecorator() user: Document) {
    return this.cartItemService.update(product, quantity, user);
  }

  @Delete(":productId")
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('productId', ObjectIdPipe, ProductIdPipe) product: Document, @UserDecorator() user: any) {
    await this.cartItemService.remove(product, user);
  }
}