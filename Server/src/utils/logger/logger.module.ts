import { Module } from "@nestjs/common";
import { CustomLoggerService } from "./logger.service";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { LoggerInterceptor } from "./interceptors/logger.interceptor";

/**
 * - Provides the CustomLoggerService for logging and the LoggerInterceptor for logging HTTP requests.
 * - Registers the LoggerInterceptor globally using the APP_INTERCEPTOR token.
 */
@Module({
  providers: [
    CustomLoggerService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerInterceptor
    },
  ],
  exports: [CustomLoggerService]
})
export class LoggerModule {}