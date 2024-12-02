import {
  HttpStatus,
  MiddlewareConsumer,
  Module,
  ValidationPipe
} from "@nestjs/common";
import {
  APP_FILTER,
  APP_GUARD,
  APP_PIPE
} from "@nestjs/core";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { AddressesModule } from "./addresses/addresses.module";
import { AuthModule } from "./auth/auth.module";
import { JwtAuthGuard } from "./auth/guards/jwtAuth.guard";
import { RolesGuard } from "./auth/guards/roles.guard";
import { CartItemModule } from "./cartItem/cartItem.module";
import { CategoriesModule } from "./categories/categories.module";
import { PaymentMethodsModule } from "./paymentsMethods/paymentMethods.module";
import { ProductsModule } from "./products/products.module";
import { ProductsReviewsModule } from "./productsReviews/productsReviews.module";
import { UsersModule } from "./users/users.module";
import { CsrfModule } from "./utils/csrf/csrf.module";
import { LoggerExceptionFilter } from "./utils/logger/filters/loggerException.filter";
import { LoggerModule } from "./utils/logger/logger.module";
import { MessagingModule } from "./utils/messaging/messaging.module";
import { envVariablesValidationSchema } from "./utils/shared/config/envValidation.schema";
import { RequestTimingMiddleware } from "./utils/shared/middlewares/requestTiming.middleware";
import { WishListModule } from "./wishList/wishList.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: envVariablesValidationSchema,
      isGlobal: true,
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => [{
        ttl: configService.get<number>("THROTTLE_TTL"),
        limit: configService.get<number>("THROTTLE_LIMIT")
      }],
      inject: [ConfigService]
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>("DB_URI")
      }),
      inject: [ConfigService]
    }),
    LoggerModule,
    AuthModule,
    UsersModule,
    CategoriesModule,
    ProductsModule,
    ProductsReviewsModule,
    AddressesModule,
    PaymentMethodsModule,
    MessagingModule,
    WishListModule,
    CartItemModule,
    CsrfModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard
    },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE,
      })
    },
    {
      provide: APP_FILTER,
      useClass: LoggerExceptionFilter
    }
  ],
})
export class AppModule { 
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestTimingMiddleware).forRoutes('*');
  }
}