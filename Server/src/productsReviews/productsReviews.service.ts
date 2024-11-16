import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Document, Model, Types } from "mongoose";
import { CreateProductReviewDto } from "./dtos/createProductReview.dto";
import { UpdateProductReviewDto } from "./dtos/updateProductReview.dto";
import { ProductsReviews } from "./entities/productsReviews.entity";
import { CreateProductReview } from "./types/createProductReview.type";
import { UpdateProductReview } from "./types/updateProductReview.type";

@Injectable()
export class ProductsReviewsService {
  constructor(@InjectModel(ProductsReviews.name) private productsReviewsModel: Model<ProductsReviews>) {}

  find(conditions: object = {}) {
    return this.productsReviewsModel.find(conditions);
  }

  findOne(id: string) {
    return this.productsReviewsModel.findById(id);
  }

  create(reviewData: CreateProductReviewDto, product: Document, user: Document) {
    const reviewInput: CreateProductReview = {
      ...reviewData,
      product: new Types.ObjectId(product._id as string),
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