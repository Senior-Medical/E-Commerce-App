import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Document, Model, Query, Types } from "mongoose";
import { CreateProductReviewDto } from "./dtos/createProductReview.dto";
import { UpdateProductReviewDto } from "./dtos/updateProductReview.dto";
import { ProductsReviews, ProductsReviewsDocument } from "./entities/productsReviews.entity";
import { ProductsService } from "src/products/products.service";
import { Product, ProductDocument } from "src/products/entities/products.entity";
import { Request } from "express";
import { UserDocument } from "src/users/entities/users.entity";

/**
 * Service to manage operations related to product reviews, such as
 * retrieval, creation, updating, and deletion. It ensures reviews
 * are linked to valid products and users.
 * 
 * Dependencies:
 * - ProductsService: Validates the existence of products for reviews.
 * - Mongoose ProductsReviews Model: Performs database operations.
 */
@Injectable()
export class ProductsReviewsService {
  constructor(
    @InjectModel(ProductsReviews.name) private productsReviewsModel: Model<ProductsReviews>,
    private readonly productsService: ProductsService
  ) { }

  /**
   * Get model of this service to use it in api feature module
   * @returns - The product model
   */
  getModel() {
    return this.productsReviewsModel;
  }

  /**
   * Get available keys in the entity that may need in search.
   * @returns - Array of strings that contain keys names
   */
  getSearchKeys() {
    return [
      "comment"
    ];
  }

  /**
   * Retrieves a list of product reviews based on specified conditions.
   * 
   * @param conditions - Filters to apply for fetching reviews.
   * @returns Array of product reviews.
   */
  find(req: Request & { queryBuilder: Query<ProductsReviews, Document> }, product: ProductDocument) {
    const queryBuilder = req.queryBuilder;
    if (!queryBuilder) throw new InternalServerErrorException("Query builder not found.");
    return queryBuilder.find({product: product._id}).select("-__v");
  }

  /**
   * Fetches a single product review by its ID.
   * 
   * @param id - Unique identifier of the product review.
   * @returns Product review document.
   */
  findOne(id: string) {
    return this.productsReviewsModel.findById(id).select("-__v");
  }

  /**
   * Creates a new product review.
   * 
   * @param reviewData - Data for the new review.
   * @param user - User creating the review.
   * @throws NotFoundException - If the associated product does not exist.
   * @returns Created product review.
   */
  async create(reviewData: CreateProductReviewDto, user: UserDocument) {
    const product = await this.productsService.findOne(reviewData.product.toString());
    if (!product) throw new NotFoundException("Product not found.");

    reviewData.product = product._id;
    const reviewInput: ProductsReviews = {
      ...reviewData,
      user: new Types.ObjectId(user._id as string)
    };
    return this.productsReviewsModel.create(reviewInput);
  }

  /**
   * Updates an existing product review.
   * 
   * @param review - Existing review document.
   * @param reviewData - Data to update the review with.
   * @returns Updated product review.
   */
  update(review: ProductsReviewsDocument, reviewData: UpdateProductReviewDto) {
    const reviewInput: Partial<ProductsReviews> = {
      ...reviewData
    };
    return review.set(reviewInput).save();
  }

  /**
   * Deletes a product review.
   * 
   * @param review - Review document to delete.
   * @returns Result of the delete operation.
   */
  remove(review: ProductsReviewsDocument) {
    return review.deleteOne();
  }
}