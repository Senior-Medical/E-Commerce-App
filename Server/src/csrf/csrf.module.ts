import { Module } from "@nestjs/common";
import { CsrfService } from "./csrf.service";
import { CsrfController } from "./csrf.controller";

@Module({
  controllers: [CsrfController],
  providers: [CsrfService],
  exports: [CsrfService]
})
export class CsrfModule { }