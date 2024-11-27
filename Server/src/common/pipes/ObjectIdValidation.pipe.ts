import { ArgumentMetadata, Injectable, NotAcceptableException, PipeTransform } from "@nestjs/common";
import { Types } from "mongoose";

@Injectable()
export class ObjectIdPipe implements PipeTransform {
  transform(objectId: string, metadata: ArgumentMetadata) {
    if (!Types.ObjectId.isValid(objectId)) throw new NotAcceptableException("Invalid Mongo Id");
    return objectId;
  }
}