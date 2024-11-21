import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Product, ProductSchema } from "./entities/products.entity";
import { ProductsController } from "./products.controller";
import { ProductsService } from "./products.service";
import { CategoriesModule } from "src/categories/categories.module";
import { MulterModule } from "@nestjs/platform-express";
import { multerOptions } from "./config/multer.config";
import { FilesModule } from "src/files/files.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Product.name,
        schema: ProductSchema
      }
    ]),
    MulterModule.register(multerOptions()),
    CategoriesModule,
    FilesModule
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService]
})
export class ProductsModule { }