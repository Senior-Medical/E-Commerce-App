import {
  Injectable,
  NotAcceptableException,
  PipeTransform
} from "@nestjs/common";
import { CategoriesServices } from "src/categories/categories.service";
import { CreateProductDto } from "../dtos/createProduct.dto";

/**
 * Validates the `category` field in a request body.
 * Ensures the category exists and replaces the field with the category's ID.
 */
@Injectable()
export class CategoryIdPipe implements PipeTransform {
  constructor(private readonly categoriesServices: CategoriesServices) { }

  async transform(body: CreateProductDto) {
    if (body.category) {
      const category = await this.categoriesServices.findOne(body.category.toString());
      if (!category) throw new NotAcceptableException("Invalid category id.");
      body.category = category._id;
    }
    return body;
  }
}