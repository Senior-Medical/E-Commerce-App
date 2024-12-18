import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseInterceptors
} from "@nestjs/common";
import { Request } from "express";
import { Query } from "mongoose";
import { Roles } from "src/auth/decorators/roles.decorator";
import { Role } from "src/auth/enums/roles.enum";
import { ApiFeatureInterceptor } from "src/utils/apiFeature/interceptors/apiFeature.interceptor";
import { ObjectIdPipe } from "src/utils/shared/pipes/ObjectIdValidation.pipe";
import { CategoriesServices } from "./categories.service";
import { CreateCategoryDto } from "./dtos/creatCategory.dto";
import { UpdateCategoryDto } from "./dtos/updateCategory.dto";
import { Category, CategoryDocument } from "./entities/categories.entity";
import { CategoryIdPipe } from "./pipes/categoryIdValidation.pipe";
import { UserDocument } from "src/users/entities/users.entity";
import { GetObjectFromRequestDecorator } from "src/utils/shared/decorators/getObjectFromRequest.decorator";

/**
 * Controller class that defines the HTTP endpoints for managing categories. 
 * It provides routes to find, create, update, and delete categories and uses 
 * `CategoriesService` to perform the business logic.
 */
@Controller("categories")
@Roles(Role.admin, Role.staff)
export class CategoriesController{
  constructor(private readonly categoriesServices: CategoriesServices) { }
  
  /**
   * Retrieves all categories with populated created and updated by user info.
   * 
   * @returns List of categories with populated user data.
   */
  @Get()
  @UseInterceptors(ApiFeatureInterceptor)
  find(@Req() req: Request & { queryBuilder: Query<Category, CategoryDocument> }) {
    return this.categoriesServices.find(req).populate("createdBy", "name username").populate("updatedBy", "name username");
  }

  /**
   * Retrieves a category by its ID.
   * 
   * @param categoryId - The ID of the category.
   * @returns The category with populated user data.
   */
  @Get(":categoryId")
  async findOne(@Param("categoryId", ObjectIdPipe, CategoryIdPipe) category: CategoryDocument) {
    return (await category.populate("createdBy", "name username")).populate("updatedBy", "name username");
  }

  /**
   * Creates a new category.
   * 
   * @param categoryData - The data for the new category.
   * @param user - The user creating the category.
   * @returns The created category.
   */
  @Post()
  create(
    @Body() categoryData: CreateCategoryDto,
    @GetObjectFromRequestDecorator('user') user: UserDocument
  ) {
    return this.categoriesServices.create(categoryData, user);
  }

  /**
   * Updates an existing category.
   * 
   * @param categoryId - The ID of the category to update.
   * @param categoryData - The data to update the category.
   * @param user - The user performing the update.
   * @returns The updated category.
   */
  @Patch(":categoryId")
  @HttpCode(HttpStatus.ACCEPTED)
  update(
    @Param("categoryId", ObjectIdPipe, CategoryIdPipe) category: CategoryDocument,
    @Body() categoryData: UpdateCategoryDto,
    @GetObjectFromRequestDecorator('user') user: UserDocument
  ) {
    return this.categoriesServices.update(category, categoryData, user);
  }

  /**
   * Deletes a category.
   * 
   * @param categoryId - The ID of the category to delete.
   * @returns The result of the delete operation.
   */
  @Delete(":categoryId")
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param("categoryId", ObjectIdPipe, CategoryIdPipe) category: CategoryDocument) {
    await this.categoriesServices.remove(category);
  }
}