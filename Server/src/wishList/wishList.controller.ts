import { Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Req, UseInterceptors } from "@nestjs/common";
import { Request } from "express";
import { Document, Query } from "mongoose";
import { ProductIdPipe } from "src/products/pipes/productIdValidation.pipe";
import { UserDecorator } from "src/users/decorators/user.decorator";
import { User, UserDocument } from "src/users/entities/users.entity";
import { ApiFeatureInterceptor } from "src/utils/apiFeature/interceptors/apiFeature.interceptor";
import { ObjectIdPipe } from "src/utils/shared/pipes/ObjectIdValidation.pipe";
import { WishList } from "./entities/wishList.entity";
import { WishListService } from './wishList.service';
import { ProductDocument } from "src/products/entities/products.entity";

/**
 * Controller for handling wish list API endpoints.
 */
@Controller("wishList")
export class WishListController {
  constructor(private readonly wishListService: WishListService) { }

  /**
   * Retrieves the user's wish list.
   * @param user - The user document (from the decorator).
   * @returns The list of wish list items.
   */
  @Get()
  @UseInterceptors(ApiFeatureInterceptor)
  async find(@Req() req: Request & { queryBuilder: Query<WishList, Document>, user: UserDocument }) {
    return this.wishListService.find(req);
  }

  /**
   * Adds a product to the user's wish list.
   * @param product - The product document (validated by pipes).
   * @param user - The user document (from the decorator).
   * @returns The created wish list item.
   */
  @Post("/:productId")
  async create(@Param("productId", ObjectIdPipe, ProductIdPipe) product: ProductDocument, @UserDecorator() user: UserDocument) {
    return this.wishListService.create(product, user);
  }

  /**
   * Removes a product from the user's wish list.
   * @param product - The product document (validated by pipes).
   * @param user - The user document (from the decorator).
   * @returns HTTP 204 No Content on success.
   */
  @Delete("/:productId")
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param("productId", ObjectIdPipe, ProductIdPipe) product: ProductDocument, @UserDecorator() user: UserDocument) {
    await this.wishListService.remove(product, user);
  }
}