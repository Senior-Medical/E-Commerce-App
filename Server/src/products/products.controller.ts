import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { ConfigService } from '@nestjs/config';
import { FilesInterceptor } from "@nestjs/platform-express";
import { Document } from "mongoose";
import { Public } from "src/auth/decorators/public.decorator";
import { Roles } from "src/auth/decorators/roles.decorator";
import { Role } from "src/auth/enums/roles.enum";
import { ObjectIdPipe } from "src/common/pipes/ObjectIdValidation.pipe";
import { UserDecorator } from "src/users/decorators/user.decorator";
import { FilesService } from '../files/files.service';
import { CreateProductDto } from "./dtos/createProduct.dto";
import { UpdateProductDto } from "./dtos/updateProduct.dto";
import { CategoryIdPipe } from './pipes/categoryIdValidation.pipe';
import { ProductIdPipe } from "./pipes/productIdValidation.pipe";
import { ProductImagesValidationPipe } from "./pipes/productImagesValidation.pipe";
import { ProductsService } from './products.service';

@Controller("products")
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly filesService: FilesService,
    private readonly configService: ConfigService
  ) { }
  
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

  @Get("images/:imageName")
  @Public()
  serveImage(@Param("imageName") imageName: string) {
    return this.filesService.serveFile(imageName);
  }

  @Post()
  @Roles(Role.admin, Role.staff)
  @UseInterceptors(FilesInterceptor("images", 10))
  create(
    @Body(CategoryIdPipe) productData: CreateProductDto,
    @UploadedFiles(ProductImagesValidationPipe) images: Array<Express.Multer.File>,
    @UserDecorator() user: Document
  ) {
    return this.productsService.create(productData, images, user);
  }

  @Patch(":productId")
  @Roles(Role.admin, Role.staff)
  @HttpCode(HttpStatus.ACCEPTED)
  @UseInterceptors(FilesInterceptor("images", 10))
  update(
    @Param("productId", ObjectIdPipe, ProductIdPipe) product: Document,
    @Body(CategoryIdPipe) productData: UpdateProductDto,
    @UploadedFiles(ProductImagesValidationPipe) images: Array<Express.Multer.File>,
    @UserDecorator() user: Document
  ) {
    return this.productsService.update(product, productData, images, user);
  }

  @Delete(":productId")
  @Roles(Role.admin, Role.staff)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param("productId", ObjectIdPipe, ProductIdPipe) product: Document) {
    await this.productsService.remove(product);
  }
}