import {DEFAULT_ERROR} from "./../constants/messages";
import {ExecutionContext, HttpException, Injectable, UnauthorizedException} from "@nestjs/common";
import {AuthGuard} from "@nestjs/passport";
import {ErrorCodeEnum} from "../enums";

@Injectable()
export class JwtNotRequiredGuard extends AuthGuard("jwt") {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err: HttpException, user: any) {
    if (err || !user) {
      return null;
    }
    return user;
  }
}
