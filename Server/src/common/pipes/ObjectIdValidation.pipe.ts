import { ArgumentMetadata, Injectable, NotAcceptableException, PipeTransform } from "@nestjs/common";
import { Types } from "mongoose";

/**
 * A pipe used to validate MongoDB ObjectIds. 
 * It checks if the provided string is a valid ObjectId using Mongoose's `Types.ObjectId.isValid()` method.
 * If the ObjectId is invalid, it throws a `NotAcceptableException` with the message "Invalid Mongo Id".
 * This pipe ensures that only valid MongoDB ObjectIds are passed to the handler.
 */
@Injectable()
export class ObjectIdPipe implements PipeTransform {
  transform(objectId: string, metadata: ArgumentMetadata) {
    if (!Types.ObjectId.isValid(objectId)) throw new NotAcceptableException("Invalid Mongo Id");
    return objectId;
  }
}