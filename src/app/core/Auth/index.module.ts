import {Module} from "@nestjs/common";
import {AuthController} from "./index.controller";
import {AuthService} from "./index.service";
import {JwtModule} from "@nestjs/jwt";
import {JWT_CONFIG} from "src/env";
import {JwtStrategy} from "src/common/strategies/jwt.strategy";
import {UserModule} from "../User/index.module";
import {PassportModule} from "@nestjs/passport";
import {CustomerModule} from "../Customer/index.module";
import {BaseModule} from "src/app/base/base.module";

@Module({
  imports: [
    UserModule,
    CustomerModule,
    PassportModule,
    BaseModule,
    JwtModule.register({
      secret: JWT_CONFIG.SECRET,
      signOptions: {expiresIn: "1d"}
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [JwtStrategy]
})
export class AuthModule {}
