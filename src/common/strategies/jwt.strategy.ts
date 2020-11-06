import {JWT_CONFIG} from "src/env";
import {ExtractJwt, Strategy} from "passport-jwt";
import {PassportStrategy} from "@nestjs/passport";
import {Injectable, UnauthorizedException} from "@nestjs/common";
import {DEFAULT_ERROR} from "../constants";
import {CustomerService} from "src/app/core/Customer/index.service";
import {UserService} from "src/app/core/User/index.service";
import {TJwtPayload} from "../type";
import {pickServiceToValidate} from "src/utils";
import {ErrorCodeEnum} from "../enums";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userService: UserService,
    private customerService: CustomerService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_CONFIG.SECRET
    });
  }

  async validate(payload: TJwtPayload) {
    const {type, userId} = payload;
    const service = pickServiceToValidate(type, this);
    const user = await service.findOne({
      where: {
        id: userId
      },
      relations: ["role", "role.permissions"]
    })
    if (!user) throw new UnauthorizedException(
      DEFAULT_ERROR.Unauthorized,
      ErrorCodeEnum.UNAUTHORIZED
    )
    return user;
  }
}
