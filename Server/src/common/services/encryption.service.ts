import { Injectable } from "@nestjs/common";
import { ConfigService } from '@nestjs/config';
import { createCipheriv, createDecipheriv } from "crypto";
import * as bcrypt from 'bcrypt';

@Injectable()
export class EncryptionService {
  constructor(private readonly configService: ConfigService) { }
  
  private readonly algorithm = this.configService.get<string>("ENCRYPTION_ALGORITHM");
  private readonly key = this.configService.get<string>("ENCRYPTION_KEY");
  private readonly iv = this.configService.get<string>("ENCRYPTION_IV");
  private readonly saltNumber = this.configService.get<number>('BCRYPT_SALT_ROUNDS') || 10;

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

  async bcryptHash(data: string) {
    const salt = await bcrypt.genSalt(this.saltNumber);
    return bcrypt.hash(data, salt);
  }

  async bcryptCompare(password: string, hashedPassword: string) {
    return bcrypt.compare(password, hashedPassword);
  }
}