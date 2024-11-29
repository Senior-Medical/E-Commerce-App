import { ArgumentMetadata, Injectable, NotAcceptableException, PipeTransform } from "@nestjs/common";
import { FilesService } from '../../files/files.service';
import { UploadDirs } from "src/files/enums/uploadDirs.enum";

/**
 * Validates uploaded profile images.
 * - Checks the MIME type to ensure it is a valid image.
 * - Generates a filename for the image based on its MIME type.
 */
@Injectable()
export class ProfileImagesValidationPipe implements PipeTransform {
  constructor(private readonly filesService: FilesService) { }
  
  transform(image: Express.Multer.File, metadata: ArgumentMetadata) {
    if (!image) return undefined;
    const mimeType = this.filesService.getMimeType(image.buffer);
    if (!mimeType) throw new NotAcceptableException("Invalid image file.");
    image.filename = this.filesService.generateFilename(mimeType, UploadDirs.USERS);
    return image;
  }
}