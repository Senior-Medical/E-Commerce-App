import { Body, Controller, Post } from "@nestjs/common";
import { MessagingService } from "./messaging.service";

@Controller("messaging")
export class MessagingController {
  constructor(private messagingService: MessagingService) { }
  @Post()
  sendMessage(@Body() body: {message: string, email: string, subject: string}) {
    this.messagingService.sendEmail(body);
  }
}