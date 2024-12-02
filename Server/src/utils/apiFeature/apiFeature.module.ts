import { Module } from "@nestjs/common";
import { ApiFeatureService } from "./apiFeature.service";

@Module({
  providers: [ApiFeatureService],
  exports: [ApiFeatureService],
})
export class ApiFeatureModule {}