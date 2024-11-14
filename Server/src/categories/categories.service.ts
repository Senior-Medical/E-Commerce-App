import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Document, Model, Types } from "mongoose";
import { Category } from "./entities/categories.entity";
import { CreateCategoryDto } from "./dtos/creatCategory.dto";
import { UpdateCategoryDto } from "./dtos/updateCategory.dto";
import { CreateCategory } from "./types/createCategoryData.type";
import { UpdateCategory } from "./types/updateCategoryData.type";

@Injectable()
export class CategoriesServices{
  constructor(@InjectModel(Category.name) private categoriesModel: Model<Category>) { }

  find(conditions: any) {
    return this.categoriesModel.find(conditions);
  }

  findOne(id: string) {
    return this.categoriesModel.findById(id);
  }

  async create(categoryData: CreateCategoryDto, user: Document) {
    const category = (await this.find({ name: categoryData.name }))[0];
    if (category) throw new HttpException('Name already exist.', HttpStatus.CONFLICT);

    const userId = user._id as string;
    const inputData: CreateCategory = {
      ...categoryData,
      createdBy: new Types.ObjectId(userId),
      updatedBy: new Types.ObjectId(userId),
    };
    return this.categoriesModel.create(inputData);
  }

  async update(category: Document, categoryData: UpdateCategoryDto, user: Document) {
    let categoryByName = (await this.find({ name: categoryData.name }))[0];
    if (categoryByName && categoryByName._id.toString() != category._id.toString()) throw new HttpException('Name already exist.', HttpStatus.CONFLICT);
    
    const inputData: UpdateCategory = {
      ...categoryData,
      updatedBy: new Types.ObjectId(user._id as string)
    };
    return category.set(inputData).save();
  }

  remove(category: Document) {
    return category.deleteOne();
  }
}