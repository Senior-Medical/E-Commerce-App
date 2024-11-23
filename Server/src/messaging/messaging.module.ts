import { Module } from "@nestjs/common";
import { MessagingService } from "./messaging.service";
import { SendGridClient } from "./sendGridClient.service";

@Module({
  imports: [],
  providers: [MessagingService, SendGridClient],
  exports: [MessagingService]
})
export class MessagingModule { }