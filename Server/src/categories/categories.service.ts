import { ConflictException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Document, Model, Types } from "mongoose";
import { Category } from "./entities/categories.entity";
import { CreateCategoryDto } from "./dtos/creatCategory.dto";
import { UpdateCategoryDto } from "./dtos/updateCategory.dto";

@Injectable()
export class CategoriesServices{
  constructor(
    @InjectModel(Category.name) private categoriesModel: Model<Category>
  ) { }

  find(conditions: object = {}) {
    return this.categoriesModel.find(conditions).select("-__v");
  }

  findOne(id: string) {
    return this.categoriesModel.findById(id).select("-__v");
  }

  async create(categoryData: CreateCategoryDto, user: Document) {
    const category = (await this.find({ name: categoryData.name }))[0];
    if (category) throw new ConflictException('Category already exist.');

    const userId = new Types.ObjectId(user._id as string);
    const inputData: Category = {
      ...categoryData,
      createdBy: userId,
      updatedBy: userId,
    };
    return this.categoriesModel.create(inputData);
  }

  async update(category: Document, categoryData: UpdateCategoryDto, user: Document) {
    let categoryByName = (await this.find({ name: categoryData.name }))[0];
    if (categoryByName && categoryByName._id.toString() != category._id.toString()) throw new ConflictException('Category already exist.');
    
    const inputData: Partial<Category> = {
      ...categoryData,
      updatedBy: new Types.ObjectId(user._id as string)
    };
    return category.set(inputData).save();
  }

  remove(category: Document) {
    return category.deleteOne();
  }
}