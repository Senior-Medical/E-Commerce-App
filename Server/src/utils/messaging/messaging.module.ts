import { Module } from "@nestjs/common";
import { MessagingService } from "./messaging.service";

/**
 * - Provides the MessagingService to handle email and SMS sending.
 * - Exports the MessagingService for use in other modules.
 */
@Module({
  imports: [],
  providers: [MessagingService],
  exports: [MessagingService]
})
export class MessagingModule { }