import { Module } from "@nestjs/common";
import { ApiFeatureService } from "./apiFeature.service";

/**
 * The `ApiFeatureModule` encapsulates functionality for enhancing API query capabilities.
 * 
 * Features provided:
 * - Filtering
 * - Pagination
 * - Sorting
 * - Field selection
 * - Search
 * 
 * This module exports the `ApiFeatureService` for use in other modules, enabling integration with Mongoose-based queries.
 */
@Module({
  providers: [ApiFeatureService],
  exports: [ApiFeatureService],
})
export class ApiFeatureModule {}