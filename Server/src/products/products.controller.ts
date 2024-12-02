import { Body, Controller, Delete, Get, HttpCode, HttpStatus, NotAcceptableException, Param, Patch, Post, Req, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { Request } from "express";
import { Document, Query } from "mongoose";
import { Public } from "src/auth/decorators/public.decorator";
import { Roles } from "src/auth/decorators/roles.decorator";
import { Role } from "src/auth/enums/roles.enum";
import { UserDecorator } from "src/users/decorators/user.decorator";
import { User } from "src/users/entities/users.entity";
import { ApiFeatureInterceptor } from "src/utils/apiFeature/interceptors/apiFeature.interceptor";
import { ImagesTypes } from "src/utils/files/enums/imagesTypes";
import { ObjectIdPipe } from "src/utils/shared/pipes/ObjectIdValidation.pipe";
import { FilesService } from '../utils/files/files.service';
import { CreateProductDto } from "./dtos/createProduct.dto";
import { UpdateProductDto } from "./dtos/updateProduct.dto";
import { Product } from "./entities/products.entity";
import { CategoryIdPipe } from './pipes/categoryIdValidation.pipe';
import { ProductIdPipe } from "./pipes/productIdValidation.pipe";
import { ProductImagesValidationPipe } from "./pipes/productImagesValidation.pipe";
import { ProductsService } from './products.service';

/**
 * Controller for managing product-related operations.
 * Handles endpoints for retrieving, creating, updating, and deleting products.
 */
@Controller("products")
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly filesService: FilesService,
  ) { }

  /**
   * Fetches all products with their category, creator, and updater details.
   * Accessible publicly.
   * 
   * @returns List of products with populated fields.
   */
  @Get()
  @Public()
  @UseInterceptors(ApiFeatureInterceptor)
  find(@Req() req: Request & { queryBuilder: Query<Product, Document> }) {
    return this.productsService.find(req).populate("category", "name").populate("createdBy", "name username").populate("updatedBy", "name username");
  }

  /**
   * Fetches a single product by its ID, including its category, creator, and updater details.
   * 
   * @param product - The product to retrieve, validated by pipes.
   * @returns The requested product.
   */
  @Get(":productId")
  @Public()
  async findOne(@Param("productId", ObjectIdPipe, ProductIdPipe) product: Document) {
    return (await (await product.populate("category", "name")).populate("createdBy", "name username")).populate("updatedBy", "name username");
  }

  /**
   * Serves a product image by its filename.
   * 
   * @param imageName - The name of the image file to serve.
   * @returns The requested image file.
   */
  @Get("images/:imageName")
  @Public()
  serveImage(@Param("imageName") imageName: string) {
    if (!imageName.startsWith(ImagesTypes.PRODUCTS)) throw new NotAcceptableException("Invalid image name");
    return this.filesService.serveFile(imageName);
  }

  /**
   * Creates a new product.
   * Requires admin or staff roles. Supports image upload validation.
   * 
   * @param productData - Product details, validated by `CategoryIdPipe`.
   * @param images - Uploaded product images, validated by `ProductImagesValidationPipe`.
   * @param user - The user creating the product.
   * @returns The created product.
   */
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

  /**
   * Updates an existing product.
   * Requires admin or staff roles. Supports image upload validation.
   * 
   * @param product - The product to update, validated by pipes.
   * @param productData - Updated product details, validated by `CategoryIdPipe`.
   * @param images - Updated product images, validated by `ProductImagesValidationPipe`.
   * @param user - The user performing the update.
   * @returns The updated product.
   */
  @Patch(":productId")
  @Roles(Role.admin, Role.staff)
  @HttpCode(HttpStatus.ACCEPTED)
  @UseInterceptors(FilesInterceptor("images", 10))
  update(
    @Param("productId", ObjectIdPipe, ProductIdPipe) product: Document & Product,
    @Body(CategoryIdPipe) productData: UpdateProductDto,
    @UploadedFiles(ProductImagesValidationPipe) images: Array<Express.Multer.File>,
    @UserDecorator() user: Document & User
  ) {
    return this.productsService.update(product, productData, images, user);
  }

  /**
   * Deletes a product.
   * Requires admin or staff roles.
   * 
   * @param product - The product to delete, validated by pipes.
   * @returns void
   */
  @Delete(":productId")
  @Roles(Role.admin, Role.staff)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param("productId", ObjectIdPipe, ProductIdPipe) product: Document & Product) {
    await this.productsService.remove(product);
  }
}