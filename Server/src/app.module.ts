import { HttpStatus, Logger, MiddlewareConsumer, Module, ValidationPipe } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";
import { MongooseModule } from "@nestjs/mongoose";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { AddressesModule } from "./addresses/addresses.module";
import { AuthModule } from "./auth/auth.module";
import { JwtAuthGuard } from "./auth/guards/jwtAuth.guard";
import { RolesGuard } from "./auth/guards/roles.guard";
import { CategoriesModule } from "./categories/categories.module";
import { envVariablesValidationSchema } from "./common/config/envValidation.schema";
import { RequestTimingMiddleware } from "./common/middlewares/requestTiming.middleware";
import { LoggerExceptionFilter } from "./logger/filters/loggerException.filter";
import { LoggerInterceptor } from "./logger/interceptors/logger.interceptor";
import { MessagingModule } from "./messaging/messaging.module";
import { PaymentMethodsModule } from "./paymentsMethods/paymentMethods.module";
import { ProductsModule } from "./products/products.module";
import { ProductsReviewsModule } from "./productsReviews/productsReviews.module";
import { UsersModule } from "./users/users.module";
import { LoggerModule } from "./logger/logger.module";
import { CustomLoggerService } from "./logger/logger.service";
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
    WishListModule
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