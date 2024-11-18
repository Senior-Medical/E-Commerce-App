import { HttpException, HttpStatus, Injectable, NotAcceptableException } from "@nestjs/common";
import { CreateProductDto } from "./dtos/createProduct.dto";
import { UpdateProductDto } from "./dtos/updateProduct.dto";
import { Document, Model, Types } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Product } from "./entities/products.entity";
import { CreateProduct } from "./types/createProductData.type";
import { UpdateProduct } from "./types/updateProductData.type";
import { CategoriesServices } from '../categories/categories.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productsModel: Model<Product>,
    private readonly categoriesServices: CategoriesServices
  ) { }

  find(conditions: object = {}) {
    return this.productsModel.find(conditions);
  }

  findOne(id: string) {
    return this.productsModel.findById(id);
  }

  async create(productData: CreateProductDto, user: Document) {
    // Check if category id is valid
    const category = await this.categoriesServices.findOne(productData.category.toString());
    if (!category) throw new NotAcceptableException("Invalid category id.");
    productData.category = category._id;

    // Check if name or code are taken
    const existProduct = (await this.productsModel.find({
      $or: [
        { name: productData.name },
        { code: productData.code }
      ]
    }))[0];
    if (existProduct) throw new HttpException("Product name or code is already exist", HttpStatus.CONFLICT);

    // Create the new product
    const userId = new Types.ObjectId(user._id as string);
    const productInput: CreateProduct = {
      ...productData,
      createdBy: userId,
      updatedBy: userId
    }
    return this.productsModel.create(productInput);
  }

  async update(product: Document, productData: UpdateProductDto, user: Document) {
    // Check if category id is valid
    if (productData.category) {
      const category = await this.categoriesServices.findOne(productData.category.toString());
      if (!category) throw new NotAcceptableException("Invalid category id.");
      productData.category = category._id;
    }

    // Check if name or code are taken
    const existProduct = (await this.productsModel.find({
      $or: [
        { name: productData.name },
        { code: productData.code }
      ]
    }))[0];
    if (existProduct && existProduct._id.toString() !== product._id.toString()) throw new HttpException("Product name or code is already exist", HttpStatus.CONFLICT);

    // Update the product
    const userId = new Types.ObjectId(user._id as string);
    const productInput: UpdateProduct = {
      ...productData,
      updatedBy: userId
    }
    return product.set(productInput).save();
  }

  remove(product: Document) {
    return product.deleteOne();
  }
}