import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema({ timestamps: true })
export class Address {
  @Prop({
    required: true,
    match: /^[A-Za-z0-9\s\-_,.\/]{3,50}$/
  })
  title: string;

  @Prop({
    required: true,
    match: /^[A-Za-z0-9\s\-_,.\/#]{5,100}$/
  })
  addressLine: string;

  @Prop({
    required: true,
    match: /^[A-Za-z\s]{2,56}$/
  })
  country: string;

  @Prop({
    required: true,
    minlength: 3,
    match: /^[A-Za-z\s]{2,50}$/
  })
  city: string;

  @Prop({
    required: true,
    match: /^[A-Za-z\s]{2,50}$/
  })
  state: string;

  @Prop({
    required: true,
    match: /^[A-Za-z0-9\s\-]{3,12}$/
  })
  postalCode: string;

  @Prop()
  landmark: string;

  @Prop({
    required: true,
    ref: "User"
  })
  user: Types.ObjectId;
}

export const AddressSchema = SchemaFactory.createForClass(Address);