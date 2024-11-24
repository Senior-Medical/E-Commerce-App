import { ArgumentMetadata, Injectable, NotAcceptableException, PipeTransform } from "@nestjs/common";
import { FilesService } from '../../files/files.service';

@Injectable()
export class ProfileImagesValidationPipe implements PipeTransform {
  constructor(private readonly filesService: FilesService) { }
  
  transform(image: Express.Multer.File, metadata: ArgumentMetadata) {
    if (!image) return undefined;
    const mimeType = this.filesService.getMimeType(image.buffer);
    if (!mimeType) throw new NotAcceptableException("Invalid image file.");
    image.filename = this.filesService.generateFilename(mimeType);
    return image;
  }
}