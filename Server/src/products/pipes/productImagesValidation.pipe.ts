import { ArgumentMetadata, Injectable, NotAcceptableException, PipeTransform } from "@nestjs/common";
import { FilesService } from '../../files/files.service';
@Injectable()
export class ProductImagesValidationPipe implements PipeTransform {
  constructor(private readonly filesService: FilesService) { }
  
  transform(images: Array<Express.Multer.File>, metadata: ArgumentMetadata) {
    if (!images || !images.length) return undefined;
    let newImages = images.map((image: Express.Multer.File) => {
      const mimeType = this.filesService.getMimeType(image.buffer);
      if (!mimeType) throw new NotAcceptableException("Invalid image file.");
      image.filename = `${Date.now()}-${image.originalname}`;
      return image;
    })

    return newImages;
  }
}