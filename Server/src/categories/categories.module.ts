import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Category, CategorySchema } from "./entities/categories.entity";
import { CategoriesController } from "./categories.controller";
import { CategoriesServices } from "./categories.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Category.name,
        schema: CategorySchema
      }
    ])
  ],
  controllers: [CategoriesController],
  providers: [CategoriesServices],
  exports: [CategoriesServices]
})
export class CategoriesModule{ }