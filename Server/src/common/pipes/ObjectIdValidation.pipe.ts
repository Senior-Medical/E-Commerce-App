import { ArgumentMetadata, HttpException, HttpStatus, Injectable, PipeTransform } from "@nestjs/common";
import { Types } from "mongoose";

@Injectable()
export class ObjectIdPipe implements PipeTransform {
  transform(objectId: string, metadata: ArgumentMetadata) {
    if (!Types.ObjectId.isValid(objectId)) throw new HttpException("Invalid id.", HttpStatus.NOT_ACCEPTABLE);
    return objectId;
  }
}