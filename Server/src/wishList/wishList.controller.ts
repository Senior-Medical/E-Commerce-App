import { Controller, Delete, Get, HttpCode, HttpStatus, Param, Post } from "@nestjs/common";
import { WishListService } from './wishList.service';
import { UserDecorator } from "src/users/decorators/user.decorator";
import { Document } from "mongoose";
import { ObjectIdPipe } from "src/common/pipes/ObjectIdValidation.pipe";
import { ProductIdPipe } from "src/products/pipes/productIdValidation.pipe";

@Controller("wishList")
export class WishListController {
  constructor(private readonly wishListService: WishListService) { }
  
  @Get()
  async find(@UserDecorator() user: Document) {
    return this.wishListService.find(user);
  }

  @Post("/:productId")
  async create(@Param("productId", ObjectIdPipe, ProductIdPipe) product: Document, @UserDecorator() user: Document) {
    return this.wishListService.create(product, user);
  }

  @Delete("/:productId")
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param("productId", ObjectIdPipe, ProductIdPipe) product: Document, @UserDecorator() user: Document) {
    await this.wishListService.remove(product, user);
  }
}