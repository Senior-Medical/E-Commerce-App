import { ConflictException, Injectable, InternalServerErrorException, NotAcceptableException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Document, Model, Types } from "mongoose";
import { CreateProductDto } from "./dtos/createProduct.dto";
import { UpdateProductDto } from "./dtos/updateProduct.dto";
import { Product } from "./entities/products.entity";
import { FilesService } from '../files/files.service';

/**
 * Service responsible for managing product-related operations.
 * Handles product creation, updating, retrieval, and deletion, 
 * including file handling for product images.
 * 
 * Dependencies:
 * - Mongoose Model for Product: Handles database operations.
 * - FilesService: Manages file upload and removal.
 */
@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productsModel: Model<Product>,
    private readonly filesService: FilesService
  ) { }

  /**
   * Retrieves all products matching the specified conditions.
   * Excludes version keys from the result.
   * 
   * @param conditions - Filtering criteria for retrieving products.
   * @returns List of products matching the criteria.
   */
  find(conditions: object = {}) {
    return this.productsModel.find(conditions).select("-__v");
  }

  /**
   * Retrieves a single product by its unique ID.
   * Excludes version keys from the result.
   * 
   * @param id - The unique identifier of the product.
   * @returns The product if found.
   */
  findOne(id: string) {
    return this.productsModel.findById(id).select("-__v");
  }

  /**
   * Creates a new product with the provided details and images.
   * - Ensures the product name and code are unique.
   * - Saves product images to storage and associates them with the product.
   * - Handles cleanup of uploaded files if an error occurs.
   * 
   * @param productData - Data for the new product.
   * @param images - Array of product images.
   * @param user - The user creating the product.
   * @returns The created product.
   * @throws NotAcceptableException if validation fails.
   * @throws InternalServerErrorException for file handling or database errors.
   */
  async create(productData: CreateProductDto, images: Array<Express.Multer.File>, user: Document) {
    const existProduct = await this.productsModel.findOne({
      $or: [
        { name: productData.name },
        { code: productData.code }
      ]
    });
    if (existProduct) throw new NotAcceptableException("Product name or code is already exist");
    
    if (!images) throw new NotAcceptableException("Images are required.");
    
    try {
      const imagesNames = await this.filesService.saveFiles(images);
      const userId = new Types.ObjectId(user._id.toString());
      const productInput: Product = {
        ...productData,
        images: imagesNames,
        createdBy: userId,
        updatedBy: userId
      }
      return this.productsModel.create(productInput);
    } catch (e) {
      this.filesService.removeFiles(images.map(image => image.filename));
      throw e;
    }
  }

  /**
   * Updates an existing product with the provided details and images.
   * - Validates uniqueness of product name and code.
   * - Optionally updates product images and cleans up old or failed uploads.
   * - Updates product metadata, including the updater's details.
   * 
   * @param product - The product to update.
   * @param productData - Updated data for the product.
   * @param images - Optional array of updated product images.
   * @param user - The user making the update.
   * @returns The updated product.
   * @throws HttpException if validation or file handling fails.
   */
  async update(product: any, productData: UpdateProductDto, images: Array<Express.Multer.File>, user: Document) {
    const existProduct = (await this.productsModel.find({
      $or: [
        { name: productData.name },
        { code: productData.code }
      ]
    }))[0];
    if (existProduct && existProduct._id.toString() !== product._id.toString()) throw new ConflictException("Product name or code is already exist");

    let imagesNames: string[] = [];
    if (images) {
      try {
        imagesNames = await this.filesService.saveFiles(images);
      } catch (e) {
        this.filesService.removeFiles(images.map(image => image.filename));
        throw e;
      }
    }

    const userId = new Types.ObjectId(user._id.toString());
    const productInput: Partial<Product> = {
      ...productData,
      updatedBy: userId
    }
    if (imagesNames.length) productInput.images = imagesNames;

    let result: Document;
    const oldImages = product.images;
    try {
      result = await product.set(productInput).save();
      if(productInput.images) this.filesService.removeFiles(oldImages);
    } catch (e) {
      if(productInput.images) this.filesService.removeFiles(productInput.images);
      throw e;
    }
    return result;
  }

  /**
   * Deletes a product from the database and its associated images from storage.
   * 
   * @param product - The product to delete.
   * @returns void
   */
  async remove(product: any) {
    await this.productsModel.findByIdAndDelete(product._id);
    if (product.images) this.filesService.removeFiles(product.images);
    return;
  }
}