import { Injectable, NotAcceptableException, NotFoundException, StreamableFile } from "@nestjs/common";
import { createReadStream, existsSync } from "fs";
import { unlink, mkdir, writeFile } from "fs/promises";
import { extname, join } from "path";
import { ConfigService } from '@nestjs/config';
import { lookup } from "mime-types";
import { memoryStorage } from "multer";
import { v4 as uuidv4 } from "uuid";

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

@Injectable()
export class FilesService {
  private uploadDir: string;
  private maxFileSize: number;
  constructor(private readonly configService: ConfigService) {
    this.uploadDir = this.configService.get('MULTER_UPLOADS_FOLDER');
    this.maxFileSize = parseInt(this.configService.get('MULTER_MAX_FILE_SIZE'));
    console.log(this.maxFileSize);
  }

  gitMulterOptions(fileSize: number = this.maxFileSize) {
    return {
      storage: memoryStorage(),
      limits: {fileSize},
      fileFilter: this.fileFilter
    }
  }
  
  async serveFile(filename: string) {
    filename = this.sanitizeFilename(filename);

    if (!this.isValidFileName(filename)) throw new NotAcceptableException("Invalid file name.");

    const filePath = join(this.uploadDir, filename);
    if (existsSync(filePath)) return new StreamableFile(createReadStream(filePath), {
      type: lookup(filename) || 'application/octet-stream',
    });
    else throw new NotFoundException("file not found.");
  }

  async removeFiles(filesNames: string[]) {
    let filePath: string;
    for (const fileName of filesNames) {
      filePath = join(this.uploadDir, fileName);
      try {
        await unlink(filePath);
        console.log(`File removed: ${filePath}`);
      } catch (err) {
        if (err.code === 'ENOENT') {
            console.warn(`File not found (skipping): ${filePath}`);
        } else {
            console.error(`Error removing file ${filePath}:`, err.message);
        }
      }
    }
  }

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

  getMimeType(buffer: Buffer) {
    const header = buffer.subarray(0, 8).toString('hex').toUpperCase();
    for (const [magic, mime] of Object.entries(MAGIC_NUMBERS)) {
      if (header.startsWith(magic)) {
        return mime;
      }
    }
    return undefined;
  }

  private fileFilter(req: Request, file: Express.Multer.File, callback: (error: Error | null, acceptFile: boolean) => void) {
    if (!file.mimetype.startsWith('image')) callback(new NotAcceptableException("Only image files are allowed."), false);
    else callback(null, true);
  }

  private isValidFileName(filename: string): boolean {
    return ALLOWED_EXTENSIONS.includes(extname(filename).toLowerCase());
  }

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