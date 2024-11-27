import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from "@nestjs/common";
import { Document } from "mongoose";
import { Roles } from "src/auth/decorators/roles.decorator";
import { Role } from "src/auth/enums/roles.enum";
import { ObjectIdPipe } from "src/common/pipes/ObjectIdValidation.pipe";
import { UserDecorator } from "../users/decorators/user.decorator";
import { CategoriesServices } from "./categories.service";
import { CreateCategoryDto } from "./dtos/creatCategory.dto";
import { UpdateCategoryDto } from "./dtos/updateCategory.dto";
import { CategoryIdPipe } from "./pipes/categoryIdValidation.pipe";

@Controller("categories")
@Roles(Role.admin, Role.staff)
export class CategoriesController{
  constructor(
    private readonly categoriesServices: CategoriesServices
  ) { }
  
  @Get()
  find() {
    return this.categoriesServices.find().populate("createdBy", "name username").populate("updatedBy", "name username");
  }

  @Get(":categoryId")
  async findOne(@Param("categoryId", ObjectIdPipe, CategoryIdPipe) category: Document) {
    return (await category.populate("createdBy", "name username")).populate("updatedBy", "name username");
  }

  @Post()
  create(@Body() categoryData: CreateCategoryDto, @UserDecorator() user: Document) {
    return this.categoriesServices.create(categoryData, user);
  }

  @Patch(":categoryId")
  @HttpCode(HttpStatus.ACCEPTED)
  update(@Param("categoryId", ObjectIdPipe, CategoryIdPipe) category: Document, @Body() categoryData: UpdateCategoryDto, @UserDecorator() user: Document) {
    return this.categoriesServices.update(category, categoryData, user);
  }

  @Delete(":categoryId")
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param("categoryId", ObjectIdPipe, CategoryIdPipe) category: Document) {
    await this.categoriesServices.remove(category);
  }
}