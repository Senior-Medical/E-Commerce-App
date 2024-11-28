import { Module } from "@nestjs/common";
import { FilesService } from "./files.service";
import { LoggerModule } from "src/logger/logger.module";

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