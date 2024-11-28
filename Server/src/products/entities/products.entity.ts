import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { ProductsReviews } from "src/productsReviews/entities/productsReviews.entity";

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

const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.post("findOneAndDelete", async function (doc, next) {
  if (doc) await doc.model(ProductsReviews.name).deleteMany({ product: doc._id });
  next();
})

export { ProductSchema };