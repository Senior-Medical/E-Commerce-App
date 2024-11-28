import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

/**
 * Address Entity Schema
 * Represents user addresses in the database with fields for title, location details,
 * and a reference to the user who owns the address.
 * Includes validation patterns for each field to ensure consistent and valid data.
 */
@Schema({ timestamps: true })
export class Address {
  /**
   * The title or nickname for the address.
   * Examples: "Home", "Office"
   * Must be 3-50 characters long and can include letters, numbers, spaces, and specific symbols.
   */
  @Prop({
    required: true,
    match: /^[A-Za-z0-9\s\-_,.\/]{3,50}$/
  })
  title: string;

  /**
   * The full address line.
   * Examples: "123 Main St, Apt 4B"
   * Must be 5-100 characters long and can include letters, numbers, spaces, and specific symbols.
   */
  @Prop({
    required: true,
    match: /^[A-Za-z0-9\s\-_,.\/#]{5,100}$/
  })
  addressLine: string;

  /**
   * The country where the address is located.
   * Examples: "United States", "Canada"
   * Must be 2-56 characters long and can include letters and spaces.
   */
  @Prop({
    required: true,
    match: /^[A-Za-z\s]{2,56}$/
  })
  country: string;

  /**
   * The city associated with the address.
   * Examples: "New York", "Toronto"
   * Must be 2-50 characters long and can include letters and spaces.
   */
  @Prop({
    required: true,
    match: /^[A-Za-z\s]{2,50}$/
  })
  city: string;

  /**
   * The state or province associated with the address.
   * Examples: "California", "Ontario"
   * Must be 2-50 characters long and can include letters and spaces.
   */
  @Prop({
    required: true,
    match: /^[A-Za-z\s]{2,50}$/
  })
  state: string;

  /**
   * The postal code of the address.
   * Examples: "90210", "M5V 3C6"
   * Must be 3-12 characters long and can include letters, numbers, and spaces.
   */
  @Prop({
    required: true,
    match: /^[A-Za-z0-9\s\-]{3,12}$/
  })
  postalCode: string;

  /**
   * An optional landmark near the address.
   * Examples: "Near Central Park", "Opposite City Mall"
   */
  @Prop()
  landmark?: string;

  /**
   * The ID of the user who owns the address.
   * References the `User` collection in the database.
   */
  @Prop({
    required: true,
    ref: "User",
    index: true
  })
  user: Types.ObjectId;
}

export const AddressSchema = SchemaFactory.createForClass(Address);