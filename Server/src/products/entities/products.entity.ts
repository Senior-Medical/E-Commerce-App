import {
  Prop,
  Schema,
  SchemaFactory
} from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { ProductsReviews } from "src/productsReviews/entities/productsReviews.entity";

/**
 * Product Entity Definition
 */
@Schema({timestamps: true})
export class Product {
  @Prop({
    unique: true,
    required: true
  })
  name: string;

  @Prop()
  description?: string;

  @Prop({
    required: true,
    type: [String]
  })
  images: string[];

  @Prop({
    unique: true,
    required: true
  })
  code: string;

  @Prop({
    default: 0
  })
  salesTimes?: number;

  @Prop({
    required: true
  })
  price: number;

  @Prop({
    required: true,
    ref: "Category"
  })
  category: Types.ObjectId

  @Prop({
    required: true,
    ref: "User"
  })
  createdBy: Types.ObjectId;
  
  @Prop({
    required: true,
    ref: "User"
  })
  updatedBy: Types.ObjectId;
}

/**
 * Mongoose Schema for the Product entity.
 * Represents the schema for storing product information in the database.
 * Includes hooks and relations for managing associated data and dependencies.
 */
const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.post("findOneAndDelete", async function (doc, next) {
  if (doc) await doc.model(ProductsReviews.name).deleteMany({ product: doc._id });
  next();
})

export { ProductSchema };

export type ProductDocument = Document & Product;