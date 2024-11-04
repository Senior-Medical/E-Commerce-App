import { Prop, raw, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Roles } from "src/common/enums/roles.enum";
import * as bcrypt from 'bcrypt';

@Schema({ timestamps: true })
export class User {
  @Prop({required: true})
  name: string
  
  @Prop({unique: true, index: true})
  username: string
  
  @Prop({unique: true, index: true})
  phone: string
  
  @Prop({unique: true, required: true, index: true})
  email: string

  @Prop({required: true})
  password: string

  @Prop({enum: Roles, default: "customer" })
  role: string

  @Prop()
  avatar: string

  @Prop()
  bio: string

  @Prop()
  company: string

  @Prop({default: false})
  verified: boolean

  @Prop({default: false})
  emailValidated: boolean
  
  @Prop({default: false})
  phoneValidated: boolean
  
  @Prop({default: new Date()})
  lastLogin: Date

  @Prop({default: new Date()})
  changePasswordAt: Date
  
  @Prop(raw({
    code: {type: String},
    expireAt: {type: Date}
  }))
  emailVerificationCode: Record<string, any>
  
  @Prop(raw({
    code: {type: String},
    expireAt: {type: Date}
  }))
  resetPasswordCode: Record<string, any>

  @Prop({default: 0})
  cartTotal: number
}

export const createUserSchema = (saltNumber: number = 10) => {
  const UserSchema = SchemaFactory.createForClass(User);

  UserSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
      try {
        const salt = await bcrypt.genSalt(saltNumber);
        this.password = await bcrypt.hash(this.password, salt);
        this.changePasswordAt = new Date();
        // await this.model("Token").deleteMany({ user: this._id });
        next();
      } catch (err) {
        throw err;
      }
    }
  })
  
  return UserSchema;
}