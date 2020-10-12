import {applyDecorators, SetMetadata, UseGuards} from "@nestjs/common";
import {ApiBearerAuth, ApiUnauthorizedResponse} from "@nestjs/swagger";
import {JwtAuthGuard} from "../guards/jwt.guard";
import {RolesGuard} from "../guards/racl.guard";
import {TRole} from "../type";

export function GrantAccess(...roles: TRole[]) {
  return applyDecorators(
    SetMetadata("roles", roles),
    UseGuards(JwtAuthGuard, RolesGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({description: "Unauthorized"}),
  );
}
