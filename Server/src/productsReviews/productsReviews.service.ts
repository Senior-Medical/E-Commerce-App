import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Document, Model, Types } from "mongoose";
import { CreateProductReviewDto } from "./dtos/createProductReview.dto";
import { UpdateProductReviewDto } from "./dtos/updateProductReview.dto";
import { ProductsReviews } from "./entities/productsReviews.entity";
import { CreateProductReview } from "./types/createProductReview.type";
import { UpdateProductReview } from "./types/updateProductReview.type";
import { ProductsService } from "src/products/products.service";

@Injectable()
export class ProductsReviewsService {
  constructor(
    @InjectModel(ProductsReviews.name) private productsReviewsModel: Model<ProductsReviews>,
    private readonly productsService: ProductsService
  ) { }

  find(conditions: object = {}) {
    return this.productsReviewsModel.find(conditions);
  }

  findOne(id: string) {
    return this.productsReviewsModel.findById(id);
  }

  async create(reviewData: CreateProductReviewDto, user: Document) {
    // check if product id is valid
    const product = await this.productsService.findOne(reviewData.product.toString());
    if (!product) throw new NotFoundException("Product not found.");

    reviewData.product = product._id;
    const reviewInput: CreateProductReview = {
      ...reviewData,
      user: new Types.ObjectId(user._id as string)
    };
    return this.productsReviewsModel.create(reviewInput);
  }

  update(review: Document, reviewData: UpdateProductReviewDto) {
    const reviewInput: UpdateProductReview = {
      ...reviewData
    };
    return review.set(reviewInput).save();
  }

  remove(review: Document) {
    return review.deleteOne();
  }
}