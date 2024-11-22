import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { MongooseModule } from "@nestjs/mongoose";
import { UsersModule } from "./users/users.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CategoriesModule } from "./categories/categories.module";
import { ProductsModule } from "./products/products.module";
import { ProductsReviewsModule } from "./productsReviews/productsReviews.module";
import { AddressesModule } from "./addresses/addresses.module";
import { PaymentMethodsModule } from "./paymentsMethods/paymentMethods.module";
import { MessagingModule } from "./messaging/messaging.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>("DB_URI")
      }),
      inject: [ConfigService]
    }),
    AuthModule,
    UsersModule,
    CategoriesModule,
    ProductsModule,
    ProductsReviewsModule,
    AddressesModule,
    PaymentMethodsModule,
    MessagingModule
  ],
})
export class AppModule{}