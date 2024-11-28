import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post } from "@nestjs/common";
import { CartItemService } from './cartItem.service';
import { UserDecorator } from "src/users/decorators/user.decorator";
import { Document } from "mongoose";
import { ObjectIdPipe } from "src/common/pipes/ObjectIdValidation.pipe";
import { ProductIdPipe } from "src/products/pipes/productIdValidation.pipe";

/**
 * Controller for handling cart item API endpoints.
 */
@Controller("cartItem")
export class CartItemController {
  constructor(private readonly cartItemService: CartItemService) { }

  /**
   * Retrieves the cart items for a user.
   * @param user - The user document (from the decorator).
   * @returns List of cart items.
   */
  @Get()
  find(@UserDecorator() user: Document) {
    return this.cartItemService.find(user);
  }

  /**
   * Adds a product to the user's cart.
   * @param product - The product document (validated by pipes).
   * @param quantity - The quantity of the product (validated by ParseIntPipe).
   * @param user - The user document (from the decorator).
   * @returns The created cart item.
   */
  @Post(":productId") 
  create(@Param('productId', ObjectIdPipe, ProductIdPipe) product: Document, @Body("quantity", ParseIntPipe) quantity: number, @UserDecorator() user: Document) {
    return this.cartItemService.create(product, quantity, user);
  }

  /**
   * Updates the quantity of a product in the user's cart.
   * @param product - The product document (validated by pipes).
   * @param quantity - The new quantity (validated by ParseIntPipe).
   * @param user - The user document (from the decorator).
   * @returns The updated cart item.
   */
  @Patch(":productId")
  @HttpCode(HttpStatus.ACCEPTED)
  update(@Param('productId', ObjectIdPipe, ProductIdPipe) product: Document, @Body("quantity", ParseIntPipe) quantity: number, @UserDecorator() user: Document) {
    return this.cartItemService.update(product, quantity, user);
  }

  /**
   * Removes a product from the user's cart.
   * @param product - The product document (validated by pipes).
   * @param user - The user document (from the decorator).
   * @returns HTTP 204 No Content on success.
   */
  @Delete(":productId")
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('productId', ObjectIdPipe, ProductIdPipe) product: Document, @UserDecorator() user: any) {
    await this.cartItemService.remove(product, user);
  }
}