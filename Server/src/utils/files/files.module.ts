import { Module } from "@nestjs/common";
import { LoggerModule } from "src/utils/logger/logger.module";
import { FilesService } from "./files.service";

/**
 * - Provides and exports the FilesService for handling file operations.
 * - Makes the FilesService available for use in other modules.
 */
@Module({
  imports: [LoggerModule],
  providers: [FilesService],
  exports: [FilesService]
})
export class FilesModule {}