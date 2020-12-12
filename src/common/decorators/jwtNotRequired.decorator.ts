import {applyDecorators, UseGuards} from "@nestjs/common";
import {JwtNotRequiredGuard} from "../guards/jwtNotRequired.guard";

export function AuthNotRequired() {
  return applyDecorators(
    UseGuards(JwtNotRequiredGuard)
  );
}
