import {ExecutionContext, HttpException, Injectable} from "@nestjs/common";
import {AuthGuard} from "@nestjs/passport";

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
