import { MiddlewareConsumer, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { MulterModule } from "@nestjs/platform-express";
import { CategoriesModule } from "src/categories/categories.module";
import { ApiFeatureModule } from "src/utils/apiFeature/apiFeature.module";
import { FilesModule } from "src/utils/files/files.module";
import { FilesService } from "src/utils/files/files.service";
import { setApiFeatureVariables } from "src/utils/shared/middlewares/apiFeature.middleware";
import { Product, ProductSchema } from "./entities/products.entity";
import { ProductsController } from "./products.controller";
import { ProductsService } from "./products.service";

/**
 * ProductsModule
 * 
 * Module for managing product-related features and data.
 * 
 * Features:
 * - Defines the Product entity schema for MongoDB.
 * - Provides CRUD operations for products.
 * - Integrates with CategoriesModule for category management.
 * - Utilizes FilesModule for handling product image uploads.
 * - Configures Multer for image upload processing.
 * 
 * Exports:
 * - ProductsService for use in other modules.
 */
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Product.name,
        schema: ProductSchema
      }
    ]),
    FilesModule,
    MulterModule.registerAsync({
      imports: [FilesModule],
      useFactory: (filesService: FilesService) => filesService.gitMulterOptions(),
      inject: [FilesService]
    }),
    CategoriesModule,
    ApiFeatureModule
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService]
})
export class ProductsModule {
  constructor(private readonly productsService: ProductsService) { }
  
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(setApiFeatureVariables(this.productsService)).forRoutes(ProductsController);
  }
}