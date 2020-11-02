import {applyDecorators, SetMetadata, UseGuards} from "@nestjs/common";
import {ApiBearerAuth, ApiUnauthorizedResponse} from "@nestjs/swagger";
import {Action} from "@nestjsx/crud";
import {JwtAuthGuard} from "../guards/jwt.guard";
import {RolesGuard} from "../guards/racl.guard";
import {TRaclOptions} from "../type";

export function GrantAccess({
  action,
  jwtOnly = false,
  type = "USER"
}: TRaclOptions) {
  return applyDecorators(
    SetMetadata("type", type),
    Action(action),
    jwtOnly ? UseGuards(JwtAuthGuard) : UseGuards(JwtAuthGuard, RolesGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({description: "You need to sign in"}),
  );
}
