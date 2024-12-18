import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
@Injectable()
export class AuthenticationGuard implements CanActivate{
    canActivate(context: ExecutionContext): boolean | Promise<boolean> {
        const request=context.switchToHttp().getRequest();
        return request.currentUser
    }
}