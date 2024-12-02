import { Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Req, UseInterceptors } from "@nestjs/common";
import { WishListService } from './wishList.service';
import { UserDecorator } from "src/users/decorators/user.decorator";
import { Document, Query } from "mongoose";
import { ObjectIdPipe } from "src/common/pipes/ObjectIdValidation.pipe";
import { ProductIdPipe } from "src/products/pipes/productIdValidation.pipe";
import { ApiFeatureInterceptor } from "src/apiFeature/interceptors/apiFeature.interceptor";
import { Request } from "express";
import { WishList } from "./entities/wishList.entity";
import { User } from "src/users/entities/users.entity";

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
  async find(@Req() req: Request & { queryBuilder: Query<WishList, Document>, user: Document & User }) {
    return this.wishListService.find(req);
  }

  /**
   * Adds a product to the user's wish list.
   * @param product - The product document (validated by pipes).
   * @param user - The user document (from the decorator).
   * @returns The created wish list item.
   */
  @Post("/:productId")
  async create(@Param("productId", ObjectIdPipe, ProductIdPipe) product: Document, @UserDecorator() user: Document) {
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
  async remove(@Param("productId", ObjectIdPipe, ProductIdPipe) product: Document, @UserDecorator() user: Document) {
    await this.wishListService.remove(product, user);
  }
}