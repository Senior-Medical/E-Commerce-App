import {
  ConflictException,
  Injectable,
  InternalServerErrorException
} from "@nestjs/common";
import {
  Model,
  Query,
  Types
} from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Category, CategoryDocument } from "./entities/categories.entity";
import { CreateCategoryDto } from "./dtos/creatCategory.dto";
import { UpdateCategoryDto } from "./dtos/updateCategory.dto";
import { Request } from "express";
import { UserDocument } from "src/users/entities/users.entity";

/**
 * Service class that handles business logic for categories, such as creating, 
 * updating, finding, and deleting categories. It ensures categories have unique 
 * names before performing creation or updates. 
 */
@Injectable()
export class CategoriesServices{
  constructor(
    @InjectModel(Category.name) private categoriesModel: Model<Category>
  ) { }

  /**
   * Get model of this service to use it in api feature module
   * @returns - The categories model
   */
  getModel() {
    return this.categoriesModel;
  }
  
  /**
   * Get available keys in the entity that may need in search.
   * 
   * @returns - Array of strings that contain keys names
   */
  getSearchKeys() {
    return [
      "name",
      "description"
    ];
  }

  /**
   * Finds categories based on specified operation of query builder.
   * 
   * @param req - The request object contain query builder.
   * @returns List of categories that match the conditions.
   */
  find(req: Request & { queryBuilder: Query<Category, CategoryDocument> }) {
    const queryBuilder = req.queryBuilder;
    if (!queryBuilder) throw new InternalServerErrorException("Query builder not found.");
    return queryBuilder.select("-__v");
  }

  /**
   * Finds a category by its ID.
   * 
   * @param id - The ID of the category.
   * @returns The category document.
   */
  findOne(id: string) {
    return this.categoriesModel.findById(id).select("-__v");
  }

  /**
   * Creates a new category if it does not already exist.
   * 
   * @param categoryData - Data for the new category.
   * @param user - The user creating the category.
   * @throws ConflictException if the category already exists.
   * @returns The created category.
   */
  async create(categoryData: CreateCategoryDto, user: UserDocument) {
    const category = await this.categoriesModel.findOne({ name: categoryData.name });
    if (category) throw new ConflictException('Category already exist.');

    const inputData: Category = {
      ...categoryData,
      createdBy: user._id,
      updatedBy: user._id,
    };
    return this.categoriesModel.create(inputData);
  }

  /**
   * Updates an existing category if the name is unique.
   * 
   * @param category - The category document to be updated.
   * @param categoryData - Data to update the category.
   * @param user - The user performing the update.
   * @throws ConflictException if the new category name already exists.
   * @returns The updated category document.
   */
  async update(category: CategoryDocument, categoryData: UpdateCategoryDto, user: UserDocument) {
    let categoryByName = await this.categoriesModel.findOne({ name: categoryData.name });
    if (categoryByName && categoryByName._id.toString() != category._id.toString()) throw new ConflictException('Category already exist.');
    
    const inputData: Partial<Category> = {
      ...categoryData,
      updatedBy: user._id
    };
    return category.set(inputData).save();
  }

  /**
   * Deletes a category.
   * 
   * @param category - The category document to be deleted.
   * @returns The result of the delete operation.
   */
  remove(category: CategoryDocument) {
    return category.deleteOne();
  }
}