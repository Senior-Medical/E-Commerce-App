import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
  StreamableFile
} from "@nestjs/common";
import {
  mkdir,
  unlink,
  writeFile
} from "fs/promises";
import { ConfigService } from '@nestjs/config';
import { createReadStream, existsSync } from "fs";
import { lookup } from "mime-types";
import { memoryStorage } from "multer";
import { extname, join } from "path";
import { CustomLoggerService } from "src/utils/logger/logger.service";
import { v4 as uuidv4 } from 'uuid';
import { ImagesTypes } from "./enums/imagesTypes";

const MAGIC_NUMBERS: Record<string, string> = {
  'FFD8FF': 'image/jpeg',               // JPEG
  '89504E47': 'image/png',              // PNG
  '47494638': 'image/gif',              // GIF (87a and 89a)
  '424D': 'image/bmp',                  // BMP
  '4D4D002A': 'image/tiff',             // TIFF (big-endian)
  '49492A00': 'image/tiff',             // TIFF (little-endian)
  '52494646': 'image/webp',             // WebP (check further for WEBP)
  '00000100': 'image/x-icon',           // ICO
  '00000200': 'image/x-cursor',         // CUR
  '38425053': 'image/vnd.adobe.photoshop', // PSD
  '6674797068656963': 'image/heic',     // HEIC/HEIF
};

const ALLOWED_EXTENSIONS: string[] = [
  ".jpeg",
  ".jpg",
  ".png",
  ".gif",
  ".bmp",
  ".tiff",
  ".tiff",
  ".webp",
  ".x-icon",
  ".x-cursor",
  ".vnd.adobe.photoshop",
  ".heic"
]

/**
 * - Handles file operations such as uploads, serving, removing, and managing file metadata.
 * - Utilizes Multer for file handling and supports image files with various formats.
 * - Ensures filename validation, sanitization, and secure file serving.
 */
@Injectable()
export class FilesService {
  private uploadDir: string;
  private maxFileSize: number;
  constructor(
    private readonly configService: ConfigService,
    private readonly loggerService: CustomLoggerService
  ) {
    this.uploadDir = this.configService.get('MULTER_UPLOADS_FOLDER')
    this.maxFileSize = parseInt(this.configService.get('MULTER_MAX_FILE_SIZE'));
  }

  /**
   * Returns Multer options for file uploads.
   * 
   * - Configures the storage to memory storage.
   * - Sets the file size limit and applies file filter.
   * - Accepts an optional parameter for specifying the file size limit.
   * 
   * @param fileSize - Optional parameter to set the file size limit.
   * @returns Multer configuration object with storage and file filter.
   */
  gitMulterOptions(fileSize: number = this.maxFileSize) {
    return {
      storage: memoryStorage(),
      limits: {fileSize},
      fileFilter: this.fileFilter
    }
  }
  
  /**
   * Serves a file from the server.
   * 
   * - Sanitizes the filename before processing.
   * - Verifies if the filename is valid.
   * - Reads the file and returns it as a stream if it exists.
   * - Throws NotFoundException if the file does not exist.
   * 
   * @param filename - The name of the file to be served.
   * @returns Streamable file response if the file is found.
   * @throws NotAcceptableException - If the filename is invalid.
   * @throws NotFoundException - If the file is not found.
   */
  async serveFile(filename: string): Promise<StreamableFile> {
    filename = this.sanitizeFilename(filename);
    if (!this.isValidFileName(filename)) throw new NotAcceptableException("Invalid file name.");
    const filePath = join(this.uploadDir, filename);
    if (existsSync(filePath)) return new StreamableFile(createReadStream(filePath), {
      type: lookup(filename) || 'application/octet-stream',
    });
    else throw new NotFoundException("file not found.");
  }

  /**
   * Removes multiple files from the server.
   * 
   * - Iterates over the list of filenames and attempts to delete each file.
   * - Logs success or failure for each file removal.
   * 
   * @param filesNames - Array of filenames to be removed.
   * @returns A promise that resolves when all files have been removed.
   */
  async removeFiles(filesNames: string[]) {
    let filePath: string;
    for (const fileName of filesNames) {
      filePath = join(this.uploadDir, fileName);
      try {
        await unlink(filePath);
        this.loggerService.log(`File removed: ${filePath}`, FilesService.name);
      } catch (err) {
        if (err.code === 'ENOENT') {
          this.loggerService.log(`File not found (skipping): ${filePath}`, FilesService.name);
        } else {
          this.loggerService.error(`Error removing file ${filePath}: ${err.message}`, FilesService.name);
        }
      }
    }
  }

  /**
   * Saves files to the server's upload directory.
   * 
   * - Ensures the upload directory exists.
   * - Iterates over the files and writes them to disk.
   * - Returns an array of filenames for the saved files.
   * 
   * @param files - Array of files to be saved.
   * @returns A promise that resolves to an array of saved filenames.
   */
  async saveFiles(files: Array<Express.Multer.File>): Promise<Array<string>> {
    await mkdir(this.uploadDir, { recursive: true });
    const filenames = await Promise.all(
      files.map(async (file): Promise<string> => {
        const filepath = join(this.uploadDir, file.filename);
        await writeFile(filepath, file.buffer);
        return file.filename;
      })
    );
    return filenames;
  }

  /**
   * Determines the MIME type of a file based on its buffer content.
   * 
   * - Reads the first few bytes of the file's buffer.
   * - Compares the magic number with known values to determine the MIME type.
   * 
   * @param buffer - The buffer of the file to analyze.
   * @returns The MIME type of the file if found, or undefined if the type is unknown.
   */
  getMimeType(buffer: Buffer) {
    const header = buffer.subarray(0, 8).toString('hex').toUpperCase();
    for (const [magic, mime] of Object.entries(MAGIC_NUMBERS)) {
      if (header.startsWith(magic)) {
        return mime;
      }
    }
    return undefined;
  }

  /**
   * Generates a unique filename based on MIME type.
   * 
   * - Uses the current timestamp and a UUID for uniqueness.
   * - Extracts the file extension from the MIME type.
   * 
   * @param mimeType - The MIME type of the file.
   * @returns A unique filename with the appropriate extension.
   */
  generateFilename(mimeType: string, imageType: ImagesTypes): string {
    const uuid = uuidv4();
    const ext = mimeType.split("/").pop();
    return `${imageType}-${uuid}.${ext}`;
  }

  /**
   * File filter function for Multer to accept only image files.
   * 
   * - Validates that the uploaded file is an image.
   * - Returns an error if the file is not an image.
   * 
   * @param req - The request object.
   * @param file - The file object to be validated.
   * @param callback - The callback function to return validation result.
   * @throws NotAcceptableException - If the file is not an image.
   */
  private fileFilter(req: Request, file: Express.Multer.File, callback: (error: Error | null, acceptFile: boolean) => void) {
    if (!file.mimetype.startsWith('image')) callback(new NotAcceptableException("Only image files are allowed."), false);
    else callback(null, true);
  }

  /**
   * Checks if the file's extension is in the allowed list.
   * 
   * - Validates the file extension against a predefined list of allowed extensions.
   * 
   * @param filename - The filename to be validated.
   * @returns True if the file has an allowed extension; otherwise, false.
   */
  private isValidFileName(filename: string): boolean {
    return ALLOWED_EXTENSIONS.includes(extname(filename).toLowerCase());
  }

  /**
   * Sanitizes the filename by removing illegal characters.
   * 
   * - Replaces characters that are illegal or reserved in filenames with a default replacement.
   * - Ensures the filename is no longer than 255 characters.
   * 
   * @param filename - The filename to be sanitized.
   * @param replacement - The string used to replace illegal characters (default is an empty string).
   * @returns A sanitized filename.
   */
  private sanitizeFilename(filename: string, replacement: string = ""): string {
    const illegalRe = /[\/\?<>\\:\*\|":]/g;
    const controlRe = /[\x00-\x1f\x80-\x9f]/g;
    const reservedRe = /^\.+$/;
    const windowsReservedRe = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])(\..*)?$/i;

    let sanitized = filename
      .replace(illegalRe, replacement)
      .replace(controlRe, replacement)
      .replace(reservedRe, replacement)
      .replace(windowsReservedRe, replacement);
    
    return sanitized.split("").splice(0, 255).join("");
  }
}