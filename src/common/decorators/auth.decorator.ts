import {applyDecorators, UseGuards} from "@nestjs/common";
import {ApiBearerAuth, ApiUnauthorizedResponse} from "@nestjs/swagger";
import {Action} from "@nestjsx/crud";
import {JwtAuthGuard} from "../guards/jwt.guard";
import {RolesGuard} from "../guards/racl.guard";
import {TRaclOptions} from "../type";

export function GrantAccess(options: TRaclOptions) {
  const {jwtOnly} = options || {jwtOnly: false};
  return applyDecorators(
    Action(options.action),
    jwtOnly ? UseGuards(JwtAuthGuard) : UseGuards(JwtAuthGuard, RolesGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({description: "You need to sign in"}),
  );
}
