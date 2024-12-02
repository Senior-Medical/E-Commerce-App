import {
  ArgumentMetadata,
  Injectable,
  NotAcceptableException,
  PipeTransform
} from "@nestjs/common";
import { ImagesTypes } from "src/utils/files/enums/imagesTypes";
import { FilesService } from '../../utils/files/files.service';

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
    image.filename = this.filesService.generateFilename(mimeType, ImagesTypes.USERS);
    return image;
  }
}