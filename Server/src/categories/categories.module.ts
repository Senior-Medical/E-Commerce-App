import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Category, CategorySchema } from "./entities/categories.entity";
import { CategoriesController } from "./categories.controller";
import { CategoriesServices } from "./categories.service";
import { APP_GUARD } from "@nestjs/core";
import { JwtAuthGuard } from "src/auth/guards/jwtAuth.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";

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
  providers: [
    CategoriesServices,
  ]
})
export class CategoriesModule{ }