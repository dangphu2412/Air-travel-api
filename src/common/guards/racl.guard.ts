import {Injectable, CanActivate, ExecutionContext, ForbiddenException} from "@nestjs/common";
import {Reflector} from "@nestjs/core";
import {getFeature, getAction} from "@nestjsx/crud";
import {RaclHelper} from "src/database/seed-development/seed-helper/racl.helper";
import {ErrorCodeEnum} from "../enums";
import {TJwtPayload} from "../type";
import {DEFAULT_ERROR} from "../constants";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
  ) {}

  public canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user: TJwtPayload = request.user;
    const permissions : string[] = user.permissions;
    const handler = context.getHandler();
    const controller = context.getClass();
    const feature = getFeature(controller);
    const action = getAction(handler);
    const requiredPermission: string = (new RaclHelper()).createPermission(feature, action);
    return this.matchRacls(requiredPermission, permissions);
  }

  private matchRacls(requiredPermission: string, permissions: string[]): boolean {
    if (this.isHighestRole) {
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

  private isHighestRole(permissions: string[]) {
    return permissions.some(permission => permission === "ALL");
  }

  private isPermissionAllowed(
    requiredPermission: string, currentPermissions: string[]
  ): boolean {
    return currentPermissions.some(permission => permission === requiredPermission);
  }
}
