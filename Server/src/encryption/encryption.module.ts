import { Module } from "@nestjs/common";
import { EncryptionService } from "./encryption.service";

/**
 * Module responsible for providing the encryption and password hashing functionality
 * through the `EncryptionService`. It is imported and used by other modules that require
 * encryption capabilities.
 */
@Module({
  providers: [EncryptionService],
  exports: [EncryptionService]
})
export class EncryptionModule { }