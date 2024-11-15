import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from "@nestjs/common";
import { ProductsService } from './products.service';
import { CreateProductDto } from "./dtos/createProduct.dto";
import { UserDecorator } from "src/common/decorators/user.decorator";
import { Document } from "mongoose";
import { UpdateProductDto } from "./dtos/updateProduct.dto";
import { ObjectIdPipe } from "src/common/pipes/ObjectIdValidation.pipe";
import { ProductIdPipe } from "./pipes/productIdValidation.pipe";

@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }
  
  @Get()
  find() {
    return this.productsService.find();
  }

  @Get(":productId")
  findOne(@Param("productId", ObjectIdPipe, ProductIdPipe) product: Document) {
    return product;
  }

  @Post()
  create(@Body() productData: CreateProductDto, @UserDecorator() user: Document) {
    return this.productsService.create(productData, user);
  }

  @Patch(":productId")
  @HttpCode(HttpStatus.ACCEPTED)
  update(@Param("productId", ObjectIdPipe, ProductIdPipe) product: Document, @Body() productData: UpdateProductDto, @UserDecorator() user: Document) {
    return this.productsService.update(product, productData, user);
  }

  @Delete(":productId")
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param("productId", ObjectIdPipe, ProductIdPipe) product: Document) {
    await this.productsService.remove(product);
  }
}