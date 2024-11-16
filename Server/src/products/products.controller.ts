import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from "@nestjs/common";
import { Document } from "mongoose";
import { Public } from "src/auth/decorators/public.decorator";
import { Roles } from "src/auth/decorators/roles.decorator";
import { Role } from "src/auth/enums/roles.enum";
import { UserDecorator } from "src/common/decorators/user.decorator";
import { ObjectIdPipe } from "src/common/pipes/ObjectIdValidation.pipe";
import { CreateProductDto } from "./dtos/createProduct.dto";
import { UpdateProductDto } from "./dtos/updateProduct.dto";
import { ProductIdPipe } from "./pipes/productIdValidation.pipe";
import { ProductsService } from './products.service';

@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }
  
  @Get()
  @Public()
  find() {
    return this.productsService.find();
  }
  @Get(":productId")
  @Public()
  findOne(@Param("productId", ObjectIdPipe, ProductIdPipe) product: Document) {
    return product;
  }

  @Post()
  @Roles(Role.admin, Role.staff)
  create(@Body() productData: CreateProductDto, @UserDecorator() user: Document) {
    return this.productsService.create(productData, user);
  }

  @Patch(":productId")
  @Roles(Role.admin, Role.staff)
  @HttpCode(HttpStatus.ACCEPTED)
  update(@Param("productId", ObjectIdPipe, ProductIdPipe) product: Document, @Body() productData: UpdateProductDto, @UserDecorator() user: Document) {
    return this.productsService.update(product, productData, user);
  }

  @Delete(":productId")
  @Roles(Role.admin, Role.staff)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param("productId", ObjectIdPipe, ProductIdPipe) product: Document) {
    await this.productsService.remove(product);
  }
}