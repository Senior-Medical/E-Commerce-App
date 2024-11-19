import { Injectable } from "@nestjs/common";
import { ConfigService } from '@nestjs/config';
import { createCipheriv, createDecipheriv } from "crypto";

@Injectable()
export class EncryptionService {
  constructor(private readonly configService: ConfigService) { }
  
  private readonly algorithm = this.configService.get<string>("ENCRYPTION_ALGORITHM");
  private readonly key = this.configService.get<string>("ENCRYPTION_KEY");
  private readonly iv = this.configService.get<string>("ENCRYPTION_IV");

  encrypt(data: string): string {
    const cipher = createCipheriv(this.algorithm, this.key, this.iv);
    let encryptedData = cipher.update(data, "utf-8", "hex");
    encryptedData += cipher.final("hex");
    return encryptedData;
  }

  decrypt(data: string): string {
    const decipher = createDecipheriv(this.algorithm, this.key, this.iv);
    let decryptedData = decipher.update(data, "hex", "utf-8");
    decryptedData += decipher.final("utf-8");
    return decryptedData;
  }
}