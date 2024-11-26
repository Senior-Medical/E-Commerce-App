import { HttpException, HttpStatus, Injectable, NotAcceptableException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Document, Model, Types } from "mongoose";
import { CreateProductDto } from "./dtos/createProduct.dto";
import { UpdateProductDto } from "./dtos/updateProduct.dto";
import { Product } from "./entities/products.entity";
import { CreateProduct } from "./types/createProductData.type";
import { UpdateProduct } from "./types/updateProductData.type";
import { FilesService } from '../files/files.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productsModel: Model<Product>,
    private readonly filesService: FilesService
  ) { }

  find(conditions: object = {}) {
    return this.productsModel.find(conditions).select("-__v");
  }

  findOne(id: string) {
    return this.productsModel.findById(id).select("-__v");
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
    
    try {
      const imagesNames = await this.filesService.saveFiles(images);
      const userId = new Types.ObjectId(user._id.toString());
      const productInput: CreateProduct = {
        ...productData,
        images: imagesNames,
        createdBy: userId,
        updatedBy: userId
      }
      return this.productsModel.create(productInput);
    } catch (e) {
      this.filesService.removeFiles(images.map(image => image.filename));
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
    if (images) {
      try {
        imagesNames = await this.filesService.saveFiles(images);
      } catch (e) {
        this.filesService.removeFiles(images.map(image => image.filename));
        console.error(e);
        throw new HttpException("Error in saving data", HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }

    // Update the product
    const userId = new Types.ObjectId(user._id.toString());
    const productInput: UpdateProduct = {
      ...productData,
      updatedBy: userId
    }
    if (imagesNames.length) productInput.images = imagesNames;

    let result;
    const oldImages = product.images;
    try {
      result = await product.set(productInput).save();
      if(productInput.images) this.filesService.removeFiles(oldImages);
    } catch (e) {
      if(productInput.images) this.filesService.removeFiles(productInput.images);
      console.error(e);
      throw new HttpException("Error in saving data", HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return result;
  }

  async remove(product: any) {
    await product.deleteOne();
    if (product.images) this.filesService.removeFiles(product.images);
    return;
  }
}