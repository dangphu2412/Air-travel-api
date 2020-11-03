import {
  Injectable, CanActivate, ExecutionContext,
  ForbiddenException, UnauthorizedException
} from "@nestjs/common";
import {Reflector} from "@nestjs/core";
import {getFeature, getAction} from "@nestjsx/crud";
import {RaclHelper} from "src/database/seed-development/seed-helper/racl.helper";
import {ErrorCodeEnum} from "../enums";
import {DEFAULT_ERROR} from "../constants";
import {Permission} from "../entity";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    // Get type auth from context
    const request = context.switchToHttp().getRequest();
    const {user} = request;

    const permissions : Permission[] = user.role.permissions;

    const handler = context.getHandler();
    const controller = context.getClass();

    const feature = getFeature(controller);
    const action = getAction(handler);

    const requiredPermission: string = (new RaclHelper()).createPermission(feature, action);
    this.assignUserToRequest(request, user);
    this.validateTokenExpired(user);
    return this.matchRacls(requiredPermission, permissions);
  }

  private matchRacls(requiredPermission: string, permissions: Permission[]): boolean {
    if (this.isHighestRole(permissions)) {
      return true;
    }
    if (!this.isPermissionAllowed(requiredPermission, permissions)) {
      throw new ForbiddenException(
        DEFAULT_ERROR.Forbidden,
        ErrorCodeEnum.FORBIDDEN
      );
    }
    return true;
  }

  private isHighestRole(permissions: Permission[]) {
    return permissions.some(permission => permission.name === "ALL");
  }

  private isPermissionAllowed(
    requiredPermission: string, currentPermissions: Permission[]
  ): boolean {
    return currentPermissions.some(permission => permission.name === requiredPermission);
  }

  private assignUserToRequest(request: any, user: any): void {
    request.user = user;
  }

  private validateTokenExpired(user: any) {
    if (user.hasExpiredToken) {
      throw new UnauthorizedException(
        DEFAULT_ERROR.Unauthorized,
        ErrorCodeEnum.IS_EXPIRED_TOKEN
      )
    }
  }
}
