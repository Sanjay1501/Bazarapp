import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";

// The AuthorizedGuard factory function
export const AuthorizedGuard = (allowedRoles: string[]) => {
  @Injectable()
  class RolesGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest();
      const userRoles = request?.currentUser?.roles || []; // Get roles from the user object

      // Check if the user has at least one of the allowed roles
      const isAuthorized = userRoles.some((role: string) => allowedRoles.includes(role));

      if (isAuthorized) {
        return true;
      }

      // Throw UnauthorizedException if not authorized
      throw new UnauthorizedException("Sorry, you are not authorized");
    }
  }

  // Return the dynamically created class
  return RolesGuardMixin;
};
