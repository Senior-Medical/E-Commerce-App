import { Module } from "@nestjs/common";
import { CustomLoggerService } from "./logger.service";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { LoggerInterceptor } from "./interceptors/logger.interceptor";

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