import { createParamDecorator, ExecutionContext } from "@nestjs/common";

/**
 * Retrieves the order document from the request.
 * - Simplifies access to the orders in controllers.
 */
export const OrderDecorator = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  return ctx.switchToHttp().getRequest().order;
})