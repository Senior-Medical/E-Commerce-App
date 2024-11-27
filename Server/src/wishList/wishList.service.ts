import { ConflictException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { WishList } from "./entities/wishList.entity";
import { Model } from "mongoose";
import { Document } from "mongoose";

@Injectable()
export class WishListService {
  constructor(@InjectModel(WishList.name) private wishListModel: Model<WishList>) { }
  
  find(user: Document) {
    return this.wishListModel.find({user: user._id}).select("-__v").populate("user", "name username").populate("product", "name price images description code salesTimes");
  }

  async create(product: Document, user: Document) {
    const existingWishList = await this.wishListModel.findOne({ product: product._id, user: user._id });
    if(existingWishList) throw new ConflictException("Product already in wish list");
    return this.wishListModel.create({ product: product._id, user: user._id });
  }

  remove(product: Document, user: Document) {
    return this.wishListModel.findOneAndDelete({ product: product._id, user: user._id });
  }
}