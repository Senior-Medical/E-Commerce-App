import { ArgumentMetadata, Injectable, NotAcceptableException, PipeTransform } from "@nestjs/common";
import { getMimeType } from "../utils/getMimeType";
@Injectable()
export class ProductImagesValidationPipe implements PipeTransform {
  transform(images: Array<Express.Multer.File>, metadata: ArgumentMetadata) {
    if (!images || !images.length) return undefined;
    let newImages = images.map((image: Express.Multer.File) => {
      const mimeType = getMimeType(image.buffer);
      if (!mimeType) throw new NotAcceptableException("Invalid image file.");
      image.filename = `${Date.now()}-${image.originalname}`;
      return image;
    })

    return newImages;
  }
}