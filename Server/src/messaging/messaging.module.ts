import { Module } from "@nestjs/common";
import { MessagingService } from "./messaging.service";
import { SendGridClient } from "./sendGridClient.service";
import { MessagingController } from "./messaging.controller";

@Module({
  imports: [],
  controllers: [MessagingController],
  providers: [MessagingService, SendGridClient],
  exports: [MessagingService]
})
export class MessagingModule { }