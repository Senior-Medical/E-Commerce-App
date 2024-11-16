import { CreateProductReview } from "./createProductReview.type";

export type UpdateProductReview = Partial<Omit<CreateProductReview, "user" | "product">>;