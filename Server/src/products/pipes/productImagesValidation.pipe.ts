import { ArgumentMetadata, Injectable, NotAcceptableException, PipeTransform } from "@nestjs/common";
import { ImagesTypes } from "src/files/enums/imagesTypes";
import { FilesService } from '../../files/files.service';

/**
 * Validates uploaded product images.
 * Ensures images are valid files with appropriate MIME types.
 * Assigns unique filenames to each image.
 * 
 * @returns Array of processed images.
 * @throws NotAcceptableException if validation fails.
 */
@Injectable()
export class ProductImagesValidationPipe implements PipeTransform {
  constructor(private readonly filesService: FilesService) { }
  
  transform(images: Array<Express.Multer.File>, metadata: ArgumentMetadata) {
    if (!images || !images.length) return undefined;
    let newImages = images.map((image: Express.Multer.File) => {
      const mimeType = this.filesService.getMimeType(image.buffer);
      if (!mimeType) throw new NotAcceptableException("Invalid image file.");
      image.filename = this.filesService.generateFilename(mimeType, ImagesTypes.PRODUCTS);
      return image;
    })

    return newImages;
  }
}