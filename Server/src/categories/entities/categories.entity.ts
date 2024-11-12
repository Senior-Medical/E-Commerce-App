import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema()
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