import { ArgumentMetadata, Injectable, NotAcceptableException, PipeTransform } from "@nestjs/common";
import { FilesService } from '../../files/files.service';
import {v4 as uuidv4} from 'uuid';
@Injectable()
export class ProductImagesValidationPipe implements PipeTransform {
  constructor(private readonly filesService: FilesService) { }
  
  transform(images: Array<Express.Multer.File>, metadata: ArgumentMetadata) {
    if (!images || !images.length) return undefined;
    let newImages = images.map((image: Express.Multer.File) => {
      const mimeType = this.filesService.getMimeType(image.buffer);
      if (!mimeType) throw new NotAcceptableException("Invalid image file.");
        const uuid = uuidv4();
        const ext = mimeType ? mimeType.split("/").pop() : image.mimetype.split("/").pop();
        image.filename = `${Date.now()}-${uuid}.${ext}`;
      return image;
    })

    return newImages;
  }
}