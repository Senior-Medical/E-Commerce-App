import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { CategoriesServices } from "./categories.service";
import { CategoryIdPipe } from "./pipes/categoryIdValidation.pipe";
import { Document } from "mongoose";
import { CreateCategoryDto } from "./dtos/creatCategory.dto";
import { UpdateCategoryDto } from "./dtos/updateCategory.dto";
import { UserDecorator } from "../common/decorators/user.decorator";
import { JwtAuthGuard } from "src/auth/guards/jwtAuth.guard";
import { ObjectIdPipe } from "src/common/pipes/ObjectIdValidation.pipe";

@Controller("categories")
@UseGuards(JwtAuthGuard)
export class CategoriesController{
  constructor(private readonly categoriesServices: CategoriesServices) { }
  
  @Get()
  find() {
    return this.categoriesServices.find({});
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