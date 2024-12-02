import { Injectable } from "@nestjs/common";
import { ConfigService } from '@nestjs/config';
import { createCipheriv, createDecipheriv } from "crypto";
import * as bcrypt from 'bcrypt';

/**
 * Service responsible for encrypting and decrypting data using a specified encryption algorithm.
 * It also includes bcrypt hashing and comparison methods for password management.
 */
@Injectable()
export class EncryptionService {
  constructor(private readonly configService: ConfigService) { }
  
  // Fetch encryption configuration from the environment variables.
  private readonly algorithm = this.configService.get<string>("ENCRYPTION_ALGORITHM");
  private readonly key = this.configService.get<string>("ENCRYPTION_KEY");
  private readonly iv = this.configService.get<string>("ENCRYPTION_IV");
  private readonly saltNumber = this.configService.get<number>('BCRYPT_SALT_ROUNDS') || 10;

  /**
   * Encrypts the given data using the configured encryption algorithm, key, and IV.
   * 
   * @param data - The data to encrypt.
   * @returns The encrypted data in hex format.
   */
  encrypt(data: string): string {
    const cipher = createCipheriv(this.algorithm, this.key, this.iv);
    let encryptedData = cipher.update(data, "utf-8", "hex");
    encryptedData += cipher.final("hex");
    return encryptedData;
  }

  /**
   * Decrypts the given encrypted data using the configured encryption algorithm, key, and IV.
   * 
   * @param data - The data to decrypt (in hex format).
   * @returns The decrypted data as a string.
   */
  decrypt(data: string): string {
    const decipher = createDecipheriv(this.algorithm, this.key, this.iv);
    let decryptedData = decipher.update(data, "hex", "utf-8");
    decryptedData += decipher.final("utf-8");
    return decryptedData;
  }

  /**
   * Hashes the given data using bcrypt with a configurable salt round.
   * 
   * @param data - The data to hash (typically a password).
   * @returns The hashed data.
   */
  async bcryptHash(data: string) {
    const salt = await bcrypt.genSalt(this.saltNumber);
    return bcrypt.hash(data, salt);
  }

  /**
   * Compares a plaintext password with a hashed password using bcrypt.
   * 
   * @param password - The plaintext password.
   * @param hashedPassword - The hashed password.
   * @returns A boolean indicating whether the passwords match.
   */
  bcryptCompare(password: string, hashedPassword: string) {
    return bcrypt.compare(password, hashedPassword);
  }
}