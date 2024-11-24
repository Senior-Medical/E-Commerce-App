import { Module } from "@nestjs/common";
import { MessagingService } from "./messaging.service";

@Module({
  imports: [],
  providers: [MessagingService],
  exports: [MessagingService]
})
export class MessagingModule { }