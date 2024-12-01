import { ConflictException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { WishList } from "./entities/wishList.entity";
import { Model } from "mongoose";
import { Document } from "mongoose";

@Injectable()
export class WishListService {
  constructor(@InjectModel(WishList.name) private wishListModel: Model<WishList>) { }

  /**
   * Get model of this service to use it in api feature module
   * @returns - The wish list model
   */
  getModel() {
    return this.wishListModel;
  }

  /**
   * Get available keys in the entity that may need in search.
   * @returns - Array of strings that contain keys names
   */
  getSearchKeys() {
    return [];
  }

  /**
   * Finds all wish list items for a user.
   * @param user - The user document.
   * @returns List of wish list items.
   */
  find(req: any) {
    const user = req.user;
    const queryBuilder = req.queryBuilder;
    return queryBuilder.find({ user: user._id }).select("-__v").populate("product", "name price images description code salesTimes");
  }

  /**
   * Adds a product to the user's wish list.
   * @param product - The product document.
   * @param user - The user document.
   * @returns The created wish list item.
   * @throws ConflictException if the product is already in the wish list.
   */
  async create(product: Document, user: Document) {
    const existingWishList = await this.wishListModel.findOne({ product: product._id, user: user._id });
    if(existingWishList) throw new ConflictException("Product already in wish list");
    return this.wishListModel.create({ product: product._id, user: user._id });
  }

  /**
   * Removes a product from the user's wish list.
   * @param product - The product document.
   * @param user - The user document.
   * @returns The deleted wish list item.
   */
  remove(product: Document, user: Document) {
    return this.wishListModel.findOneAndDelete({ product: product._id, user: user._id });
  }
}