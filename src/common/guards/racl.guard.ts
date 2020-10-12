import {Injectable, CanActivate, ExecutionContext, ForbiddenException} from "@nestjs/common";
import {Reflector} from "@nestjs/core";
import {getFeature, getAction} from "@nestjsx/crud";
import {RaclHelper} from "src/database/seed-development/seed-helper/racl.helper";
import {TRole} from "../type/t.Role";
import {Permission} from "../entity";
import {ERole} from "../enums";
import {TJwtPayload} from "../type";

type TMatchRaclParams = {
  requiredRoles: TRole[];
  requiredPermission: string;
  role: string;
  permissions: Permission[];
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
  ) {}

  public canActivate(context: ExecutionContext): boolean {
    const requiredRoles: TRole[] = this.reflector.get<TRole[]>("roles", context.getHandler());
    const request = context.switchToHttp().getRequest();
    const user: TJwtPayload = request.user;
    const role: string = user.role;
    const permissions : Permission[] = user.permissions;
    const handler = context.getHandler();
    const controller = context.getClass();

    const feature = getFeature(controller);
    const action = getAction(handler);
    const requiredPermission: string = (new RaclHelper()).createPermission(feature, action);
    if (!requiredRoles) {
      return this.isPermissionAllowed(requiredPermission, permissions)
    }
    return this.matchRacls({
      requiredRoles,
      requiredPermission,
      permissions,
      role
    });
  }

  private matchRacls(params: TMatchRaclParams): boolean {
    const {
      requiredRoles,
      requiredPermission,
      role,
      permissions
    } = params;
    const isSuperAdmin = role === ERole.SUPER_ADMIN;
    if (isSuperAdmin) {
      return true;
    }
    if (!this.isRoleAccepted(requiredRoles, role)
    || !this.isPermissionAllowed(requiredPermission, permissions)) {
      throw new ForbiddenException("You are not allow to access this resourse");
    }
    return true;
  }

  private isRoleAccepted(requiredRoles: TRole[], currentRole: string): boolean {
    return requiredRoles.some(role => role === currentRole);
  }

  private isPermissionAllowed(
    requiredPermission: string, currentPermissions: Permission[]
  ): boolean {
    return currentPermissions.some(permission => permission.name === requiredPermission);
  }
}
