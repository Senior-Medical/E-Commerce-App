import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { Document } from "mongoose";
import { Roles } from "src/auth/decorators/roles.decorator";
import { JwtAuthGuard } from "src/auth/guards/jwtAuth.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { Role } from "src/common/enums/roles.enum";
import { ObjectIdPipe } from "src/common/pipes/ObjectIdValidation.pipe";
import { UserDecorator } from "../common/decorators/user.decorator";
import { CategoriesServices } from "./categories.service";
import { CreateCategoryDto } from "./dtos/creatCategory.dto";
import { UpdateCategoryDto } from "./dtos/updateCategory.dto";
import { CategoryIdPipe } from "./pipes/categoryIdValidation.pipe";

@Controller("categories")
@Roles(Role.admin, Role.staff)
export class CategoriesController{
  constructor(private readonly categoriesServices: CategoriesServices) { }
  
  @Get()
  find() {
    return this.categoriesServices.find();
  }

  @Get(":categoryId")
  findOne(@Param("categoryId", ObjectIdPipe, CategoryIdPipe) category: string) {
    return category;
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