import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema()
export class Product {
  @Prop({
    unique: true,
    minlength: 4,
    required: true
  })
  name: string;

  @Prop()
  description: string;

  @Prop()
  cover: string;

  @Prop({
    unique: true,
    required: true
  })
  code: string;

  @Prop({
    default: 0
  })
  salesTimes: number;

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

export const ProductSchema = SchemaFactory.createForClass(Product);