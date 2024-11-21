import { HttpException, HttpStatus, Injectable, NotAcceptableException } from "@nestjs/common";
import { CreateProductDto } from "./dtos/createProduct.dto";
import { UpdateProductDto } from "./dtos/updateProduct.dto";
import { Document, Model, Types } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Product } from "./entities/products.entity";
import { CreateProduct } from "./types/createProductData.type";
import { UpdateProduct } from "./types/updateProductData.type";
import { CategoriesServices } from '../categories/categories.service';
import { ConfigService } from '@nestjs/config';
import { saveFiles } from "./utils/saveFiles";
import { removeFiles } from "./utils/removeFiles";

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productsModel: Model<Product>,
    private readonly categoriesServices: CategoriesServices,
    private readonly configService: ConfigService
  ) { }

  find(conditions: object = {}) {
    return this.productsModel.find(conditions);
  }

  findOne(id: string) {
    return this.productsModel.findById(id);
  }

  async create(productData: CreateProductDto, images: Array<Express.Multer.File>, user: Document) {
    // Check if name or code are taken
    const existProduct = (await this.productsModel.find({
      $or: [
        { name: productData.name },
        { code: productData.code }
      ]
    }))[0];
    if (existProduct) throw new NotAcceptableException("Product name or code is already exist");
    
    // Check if images are exist
    if (!images) throw new NotAcceptableException("Images are required.");
    
    const uploadDir = this.configService.get<string>('MULTER_UPLOADS_FOLDER');
    try {
      const imagesNames = await saveFiles(images, uploadDir);
      const userId = new Types.ObjectId(user._id as string);
      const productInput: CreateProduct = {
        ...productData,
        images: imagesNames,
        createdBy: userId,
        updatedBy: userId
      }
      return this.productsModel.create(productInput);
    } catch (e) {
      removeFiles(uploadDir, images.map(image => image.filename));
      console.error(e);
      throw new HttpException("Error in saving data", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(product: any, productData: UpdateProductDto, images: Array<Express.Multer.File>, user: Document) {
    // Check if name or code are taken
    const existProduct = (await this.productsModel.find({
      $or: [
        { name: productData.name },
        { code: productData.code }
      ]
    }))[0];
    if (existProduct && existProduct._id.toString() !== product._id.toString()) throw new HttpException("Product name or code is already exist", HttpStatus.CONFLICT);

    // Check if images are exist save it
    let imagesNames: string[] = [];
    const uploadDir = this.configService.get<string>('MULTER_UPLOADS_FOLDER');
    if (images) {
      try {
        imagesNames = await saveFiles(images, uploadDir);
      } catch (e) {
        removeFiles(uploadDir, images.map(image => image.filename));
        console.error(e);
        throw new HttpException("Error in saving data", HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }

    // Update the product
    const userId = new Types.ObjectId(user._id as string);
    const productInput: UpdateProduct = {
      ...productData,
      updatedBy: userId
    }
    if (imagesNames.length) productInput.images = imagesNames;

    let result;
    const oldImages = product.images;
    try {
      result = await product.set(productInput).save();
      if(productInput.images) removeFiles(uploadDir, oldImages);
    } catch (e) {
      if(productInput.images) removeFiles(uploadDir, productInput.images);
      console.error(e);
      throw new HttpException("Error in saving data", HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return result;
  }

  async remove(product: any) {
    let result;
    try {
      result = await product.deleteOne();
    }catch (e) {
      throw e;
    }
    if(product.images) removeFiles(this.configService.get<string>('MULTER_UPLOADS_FOLDER'), product.images);
    return result;
  }
}