import { HttpStatus, MiddlewareConsumer, Module, OnModuleInit, ValidationPipe } from "@nestjs/common";
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
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";
import { JwtAuthGuard } from "./auth/guards/jwtAuth.guard";
import { RolesGuard } from "./auth/guards/roles.guard";
import { CustomLogger } from "./common/services/customLogger.service";
import { LoggerInterceptor } from "./common/interceptors/logger.interceptor";
import { RequestTimingMiddleware } from "./common/middlewares/requestTiming.middleware";
import { LoggerExceptionFilter } from "./common/filters/loggerException.filter";
import { envVariablesValidationSchema } from "./common/config/envValidation.schema";

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
    AuthModule,
    UsersModule,
    CategoriesModule,
    ProductsModule,
    ProductsReviewsModule,
    AddressesModule,
    PaymentMethodsModule,
    MessagingModule
  ],
  providers: [
    CustomLogger,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerInterceptor
    },
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