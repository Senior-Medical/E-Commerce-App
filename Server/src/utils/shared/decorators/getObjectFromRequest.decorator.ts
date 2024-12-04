import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException
} from "@nestjs/common";

/**
 * Retrieves a document from the request.
 * - Simplifies access to the object in controllers.
 * @param objectName - The name of the object to retrieve from the request.
 * @returns The object from the request.
 * @throws InternalServerErrorException if the object is not found in the request.
 */
export const GetObjectFromRequestDecorator = createParamDecorator((objectName: string, ctx: ExecutionContext) => {
  const object = ctx.switchToHttp().getRequest()[objectName];
  if (!object) throw new InternalServerErrorException(`Object ${objectName} not found in request`);
  return object;
});