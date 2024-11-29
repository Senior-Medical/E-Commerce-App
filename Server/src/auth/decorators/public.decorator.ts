import { SetMetadata } from "@nestjs/common";

/**
 * Custom decorator to mark routes as public, bypassing authentication.
 * 
 * This decorator adds metadata to a route, allowing it to be accessed 
 * without authentication checks.
 */
export const Public = () => SetMetadata("isPublic", true);