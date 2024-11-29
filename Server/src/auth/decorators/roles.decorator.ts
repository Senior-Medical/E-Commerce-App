import { SetMetadata } from "@nestjs/common";
import { Role } from "../enums/roles.enum";

/**
 * Custom decorator to set roles for a route, restricting access based on user roles.
 * 
 * @param roles - An array of roles (e.g., `admin`, `customer`, `staff`) that are allowed to access the route.
 * 
 * @returns This method sets metadata for the roles associated with the route.
 */
export const Roles = (...roles: Role[]) => SetMetadata("roles", roles);