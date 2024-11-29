import { createParamDecorator, ExecutionContext } from "@nestjs/common";

/**
 * Retrieves the authenticated user from the request.
 * - Simplifies access to the current user in controllers.
 */
export const UserDecorator = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  return ctx.switchToHttp().getRequest().user;
})