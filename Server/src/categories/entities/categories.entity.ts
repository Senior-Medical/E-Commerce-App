import {
  Prop,
  Schema,
  SchemaFactory
} from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

/**
 * Mongoose schema definition for the Category model. This schema defines 
 * the structure of a category document in MongoDB, including the name, 
 * description, and references to the user who created and updated the category.
 */
@Schema({timestamps: true})
export class Category {
  @Prop({
    unique: true,
    required: true,
    index: true
  })
  name: string;

  @Prop()
  description: string;

  @Prop({
    ref: "User",
    required: true,
  })
  createdBy: Types.ObjectId;

  @Prop({
    ref: "User",
    required: true
  })
  updatedBy: Types.ObjectId;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

export type CategoryDocument = Document<Types.ObjectId> & Category;