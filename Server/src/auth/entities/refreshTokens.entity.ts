import { ConfigService } from "@nestjs/config";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

const codes = {
  "s": 1000,
  "m": 60000,
  "h": 3600000,
  "d": 86400000,
  "w": 604800000,
};

@Schema({timestamps: true})
export class RefreshToken {
  @Prop({
    required: true,
    index: true,
    unique: true
  })
  token: string;

  @Prop()
  expireAt?: Date;

  @Prop({
    ref: "User",
    required: true
  })
  user: Types.ObjectId;
}

export const getRefreshTokenSchema = (configService: ConfigService) => {
  const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);

  const JWT_REFRESH_EXPIRATION = configService.get<string>("JWT_REFRESH_EXPIRATION");
  let EXPIRATION_TIME = parseInt(JWT_REFRESH_EXPIRATION, 10);
  if (EXPIRATION_TIME.toString() !== JWT_REFRESH_EXPIRATION) EXPIRATION_TIME = codes[JWT_REFRESH_EXPIRATION[JWT_REFRESH_EXPIRATION.length - 1]] * EXPIRATION_TIME;
  RefreshTokenSchema.path('expireAt').default(() => new Date(Date.now() + EXPIRATION_TIME));
  RefreshTokenSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

  return RefreshTokenSchema;
};