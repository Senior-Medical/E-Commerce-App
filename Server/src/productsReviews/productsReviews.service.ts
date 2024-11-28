import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Document, Model, Types } from "mongoose";
import { CreateProductReviewDto } from "./dtos/createProductReview.dto";
import { UpdateProductReviewDto } from "./dtos/updateProductReview.dto";
import { ProductsReviews } from "./entities/productsReviews.entity";
import { ProductsService } from "src/products/products.service";

@Injectable()
export class ProductsReviewsService {
  constructor(
    @InjectModel(ProductsReviews.name) private productsReviewsModel: Model<ProductsReviews>,
    private readonly productsService: ProductsService
  ) { }

  find(conditions: object = {}) {
    return this.productsReviewsModel.find(conditions).select("-__v");
  }

  findOne(id: string) {
    return this.productsReviewsModel.findById(id).select("-__v");
  }

  async create(reviewData: CreateProductReviewDto, user: Document) {
    const product = await this.productsService.findOne(reviewData.product.toString());
    if (!product) throw new NotFoundException("Product not found.");

    reviewData.product = product._id;
    const reviewInput: ProductsReviews = {
      ...reviewData,
      user: new Types.ObjectId(user._id as string)
    };
    return this.productsReviewsModel.create(reviewInput);
  }

  update(review: Document, reviewData: UpdateProductReviewDto) {
    const reviewInput: Partial<ProductsReviews> = {
      ...reviewData
    };
    return review.set(reviewInput).save();
  }

  remove(review: Document) {
    return review.deleteOne();
  }
}