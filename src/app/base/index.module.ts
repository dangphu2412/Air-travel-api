import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserModule} from "../core/User/index.module";
import {UserRepository} from "../core/User/index.repository";
import {UserService} from "../core/User/index.service";
import {BaseService} from "./base.service";

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([
      UserRepository
    ])
  ],
  providers: [UserService, BaseService],
  exports: [BaseService]
})
export class BaseModule {}
