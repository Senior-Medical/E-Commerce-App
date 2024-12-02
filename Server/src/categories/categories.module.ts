import { MiddlewareConsumer, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Category, CategorySchema } from "./entities/categories.entity";
import { CategoriesController } from "./categories.controller";
import { CategoriesServices } from "./categories.service";
import { ApiFeatureModule } from "src/apiFeature/apiFeature.module";
import { setApiFeatureVariables } from "src/common/middlewares/apiFeature.middleware";

/**
 * CategoriesModule
 * 
 * This module encapsulates the functionality related to categories, including 
 * the service, controller, and Mongoose schema. It provides an API for 
 * managing categories in the system, such as creating, updating, deleting, 
 * and retrieving categories.
 * 
 * The module imports the Mongoose schema for the `Category` model, making 
 * it available for dependency injection in the service. It also exports the 
 * `CategoriesServices` to allow other modules to access category-related logic.
 */
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Category.name,
        schema: CategorySchema
      }
    ]),
    ApiFeatureModule
  ],
  controllers: [CategoriesController],
  providers: [CategoriesServices],
  exports: [CategoriesServices]
})
export class CategoriesModule {
  constructor(private readonly categoriesServices: CategoriesServices) { }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(setApiFeatureVariables(this.categoriesServices)).forRoutes(CategoriesController);
  }
}