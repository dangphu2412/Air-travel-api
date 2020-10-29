import {Module} from "@nestjs/common";
import {UserModule} from "../core/User/index.module";
import {UserService} from "../core/User/index.service";
import {BaseService} from "./base.service";

@Module({
  imports: [
    UserModule
  ],
  providers: [UserService],
  exports: [BaseService]
})
export class BaseModule {}
