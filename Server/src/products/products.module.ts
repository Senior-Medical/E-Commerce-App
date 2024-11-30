import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Product, ProductSchema } from "./entities/products.entity";
import { ProductsController } from "./products.controller";
import { ProductsService } from "./products.service";
import { CategoriesModule } from "src/categories/categories.module";
import { MulterModule } from "@nestjs/platform-express";
import { FilesModule } from "src/files/files.module";
import { FilesService } from "src/files/files.service";
import { SetModelMiddleware } from "./middlewares/setModel.middleware";
import { ApiFeatureModule } from "src/apiFeature/apiFeature.module";

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
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SetModelMiddleware).forRoutes(ProductsController);
  }
}